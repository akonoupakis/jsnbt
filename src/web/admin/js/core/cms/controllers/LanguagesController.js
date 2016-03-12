/* global angular:false */

(function () {
    "use strict";
    
    var LanguagesController = function ($scope, $rootScope, $q, $logger, $data, ModalService, AuthService) {
        jsnbt.controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;
        
        var logger = $logger.create('LanguagesController');
        
        $scope.available = false;

        this.enqueue('loaded', '', function (data) {
            var deferred = $q.defer();

            $scope.available = data.items.length < _.keys($scope.defaults.languages).length;

            deferred.resolve();
            
            return deferred.promise;
        });

        $scope.canCreate = function () {
            return $scope.available && AuthService.isAuthorized($scope.current.user, 'languages', 'C');
        };

        $scope.create = function () {
            $scope.route.next('/content/languages/new');
        };

        $scope.gridFn = {

            canEdit: function (language) {
                return AuthService.isAuthorized($scope.current.user, 'languages', 'U');
            },

            edit: function (language) {
                $scope.route.next('/content/languages/' + language.id);
            },

            setDefault: function (language) {

                var setDefaultPromise = function (data) {
                    var deferred = $q.defer();

                    $data.languages.get({ active: true }).then(function (results) {
                        if (results.length > 0) {
                            var selected = _.first(_.filter(results, function (x) { return x.code === data.code; }));
                            if (selected) {
                                var unselected = _.filter(results, function (x) { return x.code !== data.code; });

                                $data.languages.put({ id: selected.id, active: true }, { 'default': true }).then(function (result) {
                                    if (result && result.default) {
                                        if (unselected.length > 0) {

                                            var processPromise = function () {
                                                var p = unselected.shift();
                                                if (p) {
                                                    $data.languages.put(p.id, { 'default': false }).then(function () {
                                                        processPromise();
                                                    }, function (e) {
                                                        deferred.reject(e);
                                                    });
                                                }
                                                else {
                                                    deferred.resolve();
                                                }
                                            };

                                            processPromise();
                                        }
                                        else {
                                            deferred.resolve();
                                        }
                                    }
                                    else {
                                        deferred.reject();
                                    }
                                }, function (err) {
                                    deferred.reject(err);
                                });
                            }
                            else {
                                deferred.reject();
                            }
                        }
                        else {
                            deferred.reject();
                        }
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };

                setDefaultPromise(language).then(function () {
                    $($scope.data.items).each(function (i, item) {
                        if (item.code === language.code) {
                            item.default = true;
                        }
                        else {
                            item.default = false;
                        }
                    });
                }).catch(function (error) {
                    logger.error(error);
                });

            },

            canDelete: function (language) {
                return AuthService.isAuthorized($scope.current.user, 'languages', 'D');
            },

            delete: function (language) {

                var deletePromise = function (data) {
                    var deferred = $q.defer();

                    ModalService.confirm(function (x) {
                        x.title('are you sure you want to delete the language ' + data.name + '?');
                    }).then(function (confirmed) {
                        if (confirmed) {
                            $data.languages.get(data.id).then(function (response) {
                                if (!response.default) {
                                    $data.languages.del(response.id).then(function (result) {
                                        deferred.resolve(result);
                                    }, function (ex) {
                                        deferred.reject(ex);
                                    });
                                }
                                else {
                                    deferred.reject(new Error('cannot delete the default language'));
                                }
                            }).catch(function (error) {
                                deferred.reject(error);
                            });
                        }
                    });

                    return deferred.promise;
                }

                deletePromise(language).then(function () {
                    self.remove(language);
                }).catch(function (error) {
                    logger.error(error);
                });
            }

        };

        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    LanguagesController.prototype = Object.create(jsnbt.controllers.ListControllerBase.prototype);

    LanguagesController.prototype.load = function (filters, sorter) {
        var deferred = this.ctor.$q.defer();

        this.ctor.$data.languages.getPage({
            query: {
                $sort: {
                    name: 1
                }
            },
            filters: filters,
            sorter: sorter
        }).then(function (response) {
            deferred.resolve(response);
        }).catch(function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    angular.module("jsnbt")
        .controller('LanguagesController', ['$scope', '$rootScope', '$q', '$logger', '$data', 'ModalService', 'AuthService', LanguagesController]);
})();