﻿/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('LanguagesController', ['$scope', '$location', '$q', '$logger', '$data', 'PagedDataService', 'ModalService', function ($scope, $location, $q, $logger, $data, PagedDataService, ModalService) {
           
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

            };


            $scope.back = function () {
                $location.previous('/content');
            };

            $scope.create = function () {
                $location.next('/content/languages/new');
            };

            $scope.gridFn = {

                edit: function (language) {
                    $location.next('/content/languages/' + language.id);
                },

                setDefault: function (language) {
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

                },

                delete: function (language) {
                    fn.delete(language).then(function () {
                        $scope.data.items = _.filter($scope.data.items, function (x) { return x.id !== language.id; });
                    }, function (error) {
                        logger.error(error);
                    });
                }

            };

            fn.load().then(function (data) {
                $scope.data = data;
            }, function (ex) {
                logger.error(ex);
            });

        }]);
})();