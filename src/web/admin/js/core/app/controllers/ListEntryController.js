/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ListEntryController', function ($scope, $rootScope, $routeParams, $location, $timeout, $q, $logger, $queue, $data, $jsnbt, ScrollSpyService, LocationService, CONTROL_EVENTS) {
           
            var logger = $logger.create('ListEntryController');

            $scope.id = $routeParams.id;
            $scope.new = $scope.id === 'new';
            $scope.name = undefined;
            $scope.item = undefined;

            $scope.localized = false;
            $scope.languages = [];
            $scope.language = undefined;
            
            $scope.valid = true;

            $scope.published = true;
            $scope.draft = false;

            $scope.tmpl = null;
            

            var fn = {

                set: function () {
                    var deferred = $q.defer();

                    var list = _.first(_.filter($jsnbt.lists, function (x) { return x.id === $routeParams.list && x.domain === $routeParams.domain; }));
                    $scope.localized = $scope.application.localization.enabled && (list.localized === undefined || list.localized === true);

                    $scope.languages = $scope.application.languages;
                    $scope.language = $scope.application.localization.enabled ? ($scope.defaults.language ? $scope.defaults.language : _.first($scope.application.languages).code) : 'en';

                    if ($scope.new) {
                        $scope.name = '';

                        $scope.item = $data.create('data', {
                            domain: $routeParams.domain,
                            list: $routeParams.list
                        });
                        
                        $scope.valid = true;

                        $scope.published = false;
                        $scope.draft = true;

                        deferred.resolve();
                    }
                    else {
                        $data.data.get($scope.id).then(function (result) {

                            $scope.name = result.name;
                            $scope.item = result;

                            $scope.valid = true;

                            $scope.published = true;
                            $scope.draft = false;

                            deferred.resolve();

                        }, function (error) {
                            deferred.reject(error);
                        });
                    }

                    return deferred.promise;
                },

                setLocation: function () {
                    var deferred = $q.defer();

                    var breadcrumb = LocationService.getBreadcrumb();
                    var breadcrumbLast = breadcrumb[breadcrumb.length - 2];
                    breadcrumb = breadcrumb.slice(0, breadcrumb.length - 3);
                    breadcrumb.push(breadcrumbLast);
                    if ($scope.new) {
                        breadcrumb.push({
                            name: 'new',
                            active: true
                        });
                    }
                    else {
                        breadcrumb.push({
                            name: $scope.name,
                            active: true
                        });
                    }
                    $scope.current.setBreadcrumb(breadcrumb);
                    
                    deferred.resolve(breadcrumb);

                    return deferred.promise;
                },

                setTmpl: function () {
                    var deferred = $q.defer();

                    var list = _.first(_.filter($jsnbt.lists, function (x) { return x.id === $routeParams.list && x.domain === $routeParams.domain; }));
                    $scope.tmpl = list ? list.form : null;

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
                            if ($scope.new) {
                                $data.data.post($scope.item).then(function (result) {
                                    $scope.id = result.id;
                                    deferred.resolve(true);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                            else {
                                $data.data.put($scope.id, $scope.item).then(function (result) {
                                    $scope.name = result.name;
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
                if ($rootScope.location.previous) {
                    $location.previous($rootScope.location.previous);
                }
                else {
                    if ($scope.current.breadcrumb[0].name === 'modules') {
                        $location.previous('/modules/' + $scope.item.domain + '/list/' + $scope.item.list);
                    }
                    else {
                        $location.previous('/content/data/' + $scope.item.domain + '/' + $scope.item.list);
                    }
                }
            };
                        
            $scope.discard = function () {
                fn.discard().catch(function (ex) {
                    logger.error(ex);
                });
            };

            $scope.publish = function () {
                fn.publish().then(function (success) {
                    $scope.published = success;

                    if (!success) {
                        $scope.scroll2error();
                    }
                    else {
                        if ($scope.new) {
                            if ($scope.current.breadcrumb[0].name === 'modules') {
                                $location.goto('/modules/' + $routeParams.domain + '/list/' + $routeParams.list + '/' + $scope.id);
                            }
                            else {
                                $location.goto('/content/data/' + $routeParams.domain + '/' + $routeParams.list + '/' + $scope.id);
                            }
                        }
                    }
                }, function (ex) {
                    logger.error(ex);
                });
            };

            $scope.$watch('name', function (newValue, prevValue) {
                fn.setLocation().catch(function (ex) {
                    logger.error(ex);
                });
            });

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