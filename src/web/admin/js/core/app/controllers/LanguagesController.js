/* global angular:false */

(function () {
    "use strict";
    
    var LanguagesController = function ($scope, $location, $q, $logger, $data, PagedDataService, ModalService) {
        jsnbt.ListControllerBase.apply(this, $scope.getBaseArguments($scope));
        
        $scope.available = false;

        $scope.load = function () {
            var deferred = $q.defer();
            
            PagedDataService.get(jsnbt.db.languages.get, {
                $sort: {
                    name: 1
                }
            }).then(function (response) {
                $scope.available = response.items.length < _.keys($scope.defaults.languages).length;
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        $scope.canCreate = function () {
            return $scope.available;
        };

        $scope.create = function () {
            $location.next('/content/languages/new');
        };

        $scope.gridFn = {

            edit: function (language) {
                $location.next('/content/languages/' + language.id);
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
                    }, function (error) {
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
                }, function (error) {
                    logger.error(error);
                });

            },

            delete: function (language) {

                var deletePromise = function (data) {
                    var deferred = $q.defer();

                    ModalService.open({
                        title: 'are you sure you want to delete the language ' + data.name + '?',
                        controller: 'DeletePromptController',
                        template: 'tmpl/core/modals/deletePrompt.html'
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
                            }, function (error) {
                                deferred.reject(error);
                            });
                        }
                    });

                    return deferred.promise;
                }

                deletePromise(language).then(function () {
                    $scope.remove(language);
                }, function (error) {
                    logger.error(error);
                });
            }

        };

        $scope.init();

    };
    LanguagesController.prototype = Object.create(jsnbt.ListControllerBase.prototype);

    angular.module("jsnbt")
        .controller('LanguagesController', ['$scope', '$location', '$q', '$logger', '$data', 'PagedDataService', 'ModalService', LanguagesController]);
})();