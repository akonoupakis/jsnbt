/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('LanguagesController', function ($scope, $rootScope, $location, $q, $logger, $data, PagedDataService, ModalService) {
           
            var logger = $logger.create('LanguagesController');

            $scope.data = {};
            
            var fn = {

                load: function () {
                    var deferred = $q.defer();

                    PagedDataService.get(dpd.languages.get, {
                        $sort: {
                            name: 1
                        }
                    }).then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                create: function () {
                    var deferred = $q.defer();

                    var available = _.filter($scope.defaults.languages, function (x) { return _.pluck($scope.data.items, 'code').indexOf(x.code) === -1; });
                    ModalService.open({
                        title: 'Select a language',
                        data: available,
                        template: 'tmpl/partial/modal/languageSelector.html'
                    }).then(function (language) {
                        $data.languages.get({ code: language.code }).then(function (results) {
                            if (results.length === 0) {
                                $data.languages.post($data.create('languages', { code: language.code, name: language.name })).then(function (result) {
                                  deferred.resolve(result);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                            else {
                                deferred.resolve(_.first(results));
                            }
                        }, function (ex) {
                            deferred.reject(ex);
                        });
                    });

                    return deferred.promise;
                },

                setDefault: function (data) {
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
                },

                delete: function (data) {
                    var deferred = $q.defer();

                    ModalService.open({
                        title: 'Are you sure you want to delete the language ' + data.name + '?',
                        template: 'tmpl/partial/modal/deletePrompt.html'
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

            };


            $scope.back = function () {
                $location.previous('/content');
            };

            $scope.create = function () {
                fn.create().then(function (result) {
                    $location.next('/content/languages/' + result.id);
                }, function (error) {
                    logger.error(error);
                });
            };

            $scope.edit = function (language) {
                $location.next('/content/languages/' + language.id);
            };

            $scope.setDefault = function (language) {
                fn.setDefault(language).then(function () {
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

            };
            
            $scope.delete = function (language) {
                fn.delete(language).then(function () {
                    $scope.data.items = _.filter($scope.data.items, function (x) { return x.id !== language.id; });
                }, function (error) {
                    logger.error(error);
                });
            };


            fn.load().then(function (data) {
                $scope.data = data;
            }, function (ex) {
                logger.error(ex);
            });

        });
})();