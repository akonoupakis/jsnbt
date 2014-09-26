/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ListEntryController', function ($scope, $rootScope, $routeParams, $location, $timeout, $q, $logger, $queue, $data, ScrollSpyService, LocationService, DraftService) {
           
            var logger = $logger.create('ListEntryController');

            $scope.id = $routeParams.id;
            $scope.name = undefined;
            $scope.item = undefined;

            $scope.localized = false;
            $scope.languages = [];
            $scope.language = undefined;
            
            $scope.valid = false;
            $scope.published = false;

            $scope.tmpl = null;
            

            var fn = {

                set: function () {
                    var deferred = $q.defer();

                    $data.data.get($scope.id).then(function (result) {

                        var setInternal = function (published, data) {
                            $scope.name = data.name;
                            $scope.item = data;
                            $scope.localized = (data.localization || {}).enabled;

                            $scope.languages = $scope.application.languages;
                            $scope.language = data.localization.enabled ? ($scope.defaults.language ? $scope.defaults.language : _.first($scope.application.languages).code) : data.localization.language;

                            $scope.valid = true;

                            $scope.published = published;

                            deferred.resolve();
                        };

                        DraftService.get('data', $scope.id).then(function (draftResult) {
                            setInternal(draftResult === undefined, draftResult || result);
                        }, function (draftError) {
                            deferred.reject(draftError);
                        });

                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                setLocation: function () {
                    var deferred = $q.defer();

                    var breadcrumb = LocationService.getBreadcrumb();
                    var breadcrumbLast = breadcrumb[breadcrumb.length - 2];
                    breadcrumb = breadcrumb.slice(0, breadcrumb.length - 3);
                    breadcrumb.push(breadcrumbLast);
                    breadcrumb.push({
                        name: $scope.name,
                        active: true
                    });
                    $scope.current.setBreadcrumb(breadcrumb);
                    
                    deferred.resolve(breadcrumb);

                    return deferred.promise;
                },

                setTmpl: function () {
                    var deferred = $q.defer();

                    var list = _.first(_.filter(jsnbt.lists, function (x) { return x.id === $routeParams.list && x.domain === $routeParams.domain; }));
                    $scope.tmpl = list ? list.spec : null;

                    deferred.resolve();

                    return deferred.promise;
                },

                setSpy: function (time) {
                    var deferred = $q.defer();

                    ScrollSpyService.get(time || 0).then(function (response) {
                        $scope.nav = response;
                        deferred.resolve(response);
                    });

                    return deferred.promise;
                },
                
                save: function () {
                    var deferred = $q.defer();

                    $queue.enqueue('ListEntryController:' + $scope.id + ':save', function () {
                        var d = $q.defer();
                        DraftService.set('data', $scope.id, $scope.item).then(function (response) {
                            d.resolve(response);
                        }, function (error) {
                            d.reject(error);
                        });
                        return d.promise;
                    });

                    deferred.resolve();

                    return deferred.promise;
                },

                discard: function () {
                    var deferred = $q.defer();

                    DraftService.clear('data', $scope.id).then(function (response) {
                        deferred.resolve();
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                validate: function () {
                    var deferred = $q.defer();

                    $scope.valid = true;
                    $scope.$broadcast('validate');

                    if (!$scope.valid) {
                        deferred.resolve(false);
                    }
                    else {
                        if ($scope.localized) {

                            var checkLanguage = function (lang, next) {
                                $scope.language = lang.code;

                                $timeout(function () {
                                    $scope.$broadcast('validate');

                                    if (!$scope.valid) {
                                        deferred.resolve(false);
                                    }
                                    else {
                                        next();
                                    }
                                }, 50);
                            };

                            var currentLanguage = $scope.language;
                            var restLanguages = _.filter($scope.languages, function (x) { return x.active && x.code !== currentLanguage; });
                            if (restLanguages.length > 0) {
                                var nextIndex = 0;
                                var next = function () {
                                    nextIndex++;

                                    var lang = restLanguages[nextIndex];
                                    if (lang) {
                                        checkLanguage(lang, next);
                                    }
                                    else {
                                        $scope.language = currentLanguage;

                                        deferred.resolve(true);
                                    }
                                };

                                var first = _.first(restLanguages);
                                checkLanguage(first, next);
                            }
                            else {
                                deferred.resolve(true);
                            }
                        }
                        else {
                            deferred.resolve(true);
                        }
                    }

                    return deferred.promise;
                },

                publish: function (cb) {
                    var deferred = $q.defer();

                    this.validate(function (validationResults) {
                        if (!validationResults) {
                            $('body').scrollTo($('.ctrl.invalid:visible:first'), { offset: -150, duration: 400 });
                            deferred.resolve(false);
                        }
                        else {
                            $data.data.put($scope.id, $scope.item).then(function (result) {
                                $scope.name = result.name;
                                DraftService.clear('data', $scope.id).then(function (delResponse) {
                                    deferred.resolve(true);
                                }, function (delError) {
                                    deferred.reject(delError);
                                });
                            }, function (error) {
                                deferred.reject(error);
                            });
                        }
                    });

                    return deferred.promise;
                }

            };
            

            $scope.back = function () {
                if ($rootScope.location.previous) {
                    $location.previous($rootScope.location.previous);
                }
                else {
                    if ($scope.current.breadcrumb[0].name === 'addons') {
                        $location.previous('/addons/' + $scope.item.domain + '/list/' + $scope.item.list);
                    }
                    else {
                        $location.previous('/content/data/' + $scope.item.domain + '/' + $scope.item.list);
                    }
                }
            };
                        
            $scope.discard = function () {
                fn.discard().then(function () {
                    fn.set().then(function () { }, function (setError) {
                        logger.error(setError);
                    });
                }, function (ex) {
                    logger.error(ex);
                });
            };

            $scope.publish = function () {
                fn.publish().then(function (success) {
                    $scope.published = success;
                }, function (ex) {
                    logger.error(ex);
                });
            };

            $scope.$watch('name', function (newValue, prevValue) {
                fn.setLocation().then(function () { }, function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$watch('tmpl', function (newValue, prevValue) {
                fn.setSpy(200).then(function () { }, function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$on('changed', function (sender) {
                sender.stopPropagation();
               
                fn.save().then(function () {
                    $scope.published = false;
                }, function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$on('valid', function (sender, value) {
                sender.stopPropagation();

                if (!value)
                    $scope.valid = false;
            });

     
            $timeout(function () {
                fn.set().then(function () {
                    fn.setTmpl().then(function () {}, function (ex) {
                        logger.error(ex);
                    });
                }, function (ex) {
                    logger.error(ex);
                });
            }, 200);
        });
})();