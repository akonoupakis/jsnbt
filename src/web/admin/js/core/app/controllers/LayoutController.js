/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('LayoutController', function ($scope, $rootScope, $routeParams, $location, $timeout, $q, $logger, $queue, $data, $jsnbt, ScrollSpyService, LocationService, CONTROL_EVENTS) {
           
            var logger = $logger.create('LayoutController');

            $scope.id = $routeParams.id;
            $scope.name = $routeParams.id;

            $scope.layoutId = undefined;
            $scope.layout = {};

            $scope.localized = false;
            $scope.languages = [];
            $scope.language = undefined;
            $scope.active = {};
            
            $scope.valid = true;
            $scope.published = true;

            $scope.tmpl = null;
            

            var fn = {

                set: function () {
                    var deferred = $q.defer();

                    $data.layouts.get({
                        layout: $scope.id
                    }).then(function (results) {
                        var result = _.first(results);
                        if (result) {
                            $scope.layoutId = result.id;
                            $scope.layout = result;
                        }
                        else {
                            $scope.layoutId = undefined;
                            $scope.layout = {
                                layout: $routeParams.id,
                                content: {
                                    localized: {}
                                }
                            };
                        }
                        
                        $scope.localized = $scope.application.localization.enabled;
                        $scope.languages = $scope.application.languages;
                        $scope.language = $scope.application.localization.enabled ? ($scope.defaults.language ? $scope.defaults.language : _.first($scope.application.languages).code) : 'en';

                        $scope.active = {};
                        $($scope.languages).each(function (i, item) {
                            $scope.active[item.code] = true;
                        });

                        $scope.valid = true;
                        $scope.published = true;

                        deferred.resolve();
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

                    $scope.tmpl = $jsnbt.layouts[$routeParams.id] ? $jsnbt.layouts[$routeParams.id] : null;

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

                    $scope.published = false;

                    deferred.resolve();

                    return deferred.promise;
                },

                discard: function () {
                    var deferred = $q.defer();

                    this.set().then(function (response) {
                        deferred.resolve();
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                validate: function () {
                    var deferred = $q.defer();

                    $scope.valid = true;
                    $scope.$broadcast(CONTROL_EVENTS.initiateValidation);
                    
                    if (!$scope.valid) {
                        deferred.resolve(false);
                    }
                    else {
                        if ($scope.localized) {
                            var checkLanguage = function (lang, next) {
                                $scope.language = lang.code;

                                $timeout(function () {
                                    $scope.$broadcast(CONTROL_EVENTS.initiateValidation);

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

                    this.validate().then(function (validationResults) {
                        if (!validationResults) {
                            deferred.resolve(false);
                        }
                        else {
                            if ($scope.layoutId) {
                                $data.layouts.put($scope.layoutId, {
                                    content: $scope.layout.content || {}
                                }).then(function (result) {
                                    deferred.resolve(true);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                            else {
                                $data.layouts.post($scope.layout).then(function (result) {
                                    $scope.layoutId = result.id;
                                    $scope.layout.id = result.id;
                                    deferred.resolve(true);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                        }
                    });

                    return deferred.promise;
                }

            };
            

            $scope.back = function () {
                $location.previous('/content/layouts');
            };

            $scope.discard = function () {
                fn.discard().catch(function (ex) {
                    logger.error(ex);
                });
            };

            $scope.publish = function () {
                fn.publish().then(function (success) {
                    $scope.published = success;

                    if (!success)
                        $scope.scroll2error();
                }, function (ex) {
                    logger.error(ex);
                });
            };
            

            $scope.$watch('tmpl', function (newValue, prevValue) {
                fn.setSpy(200).catch(function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$on(CONTROL_EVENTS.valueChanged, function (sender) {
                sender.stopPropagation();
               
                fn.save().then(function () {
                    $scope.published = false;
                }, function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$on(CONTROL_EVENTS.valueIsValid, function (sender, value) {
                sender.stopPropagation();

                if (!value)
                    $scope.valid = false;
            });

     
            $timeout(function () {
                fn.set().then(function () {
                    fn.setTmpl().catch(function (ex) {
                        logger.error(ex);
                    });
                }, function (ex) {
                    logger.error(ex);
                });
            }, 200);
        });
})();