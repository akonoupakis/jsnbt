/* global angular:false */

(function () {
    "use strict";

    jsnbt.FormControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.ControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('FormControllerBase');
        
        $scope.id = $routeParams.id;
        $scope.new = $scope.id === 'new' || _.str.startsWith($scope.id, 'new-');
        $scope.title = undefined;

        $scope.valid = true;

        $scope.published = true;
        $scope.draft = false;

        $scope.active = {};

        $scope.isNew = function () {
            return $scope.new;
        };

        $scope.enqueue('preloaded', function () {
            var deferred = $q.defer();

            $($scope.languages).each(function (i, item) {
                $scope.active[item.code] = item.active === true;
            });

            deferred.resolve();

            return deferred.promise;
        });

        $scope.preload = function () {
            var deferred = $q.defer();

            deferred.resolve();

            return deferred.promise;
        };

        $scope.load = function () {
            throw new Error('not implemented');
        };

        $scope.set = function (data) {
            throw new Error('not implemented');
        };

        $scope.enqueue('watch', function () {
            var deferred = $q.defer();

            $scope.$watch('title', function (newValue, prevValue) {
                if (newValue !== prevValue && newValue !== undefined) {
                    $scope.getBreadcrumb().then(function (breadcrumb) {
                        $scope.setBreadcrumb(breadcrumb).catch(function (setBreadcrumbError) {
                            throw setBreadcrumbError;
                        });
                    }).catch(function (getBreadcrumbError) {
                        throw getBreadcrumbError;
                    });
                }
            });

            deferred.resolve();

            return deferred.promise;
        });

        $scope.get = function () {
            throw new Error('not implemented');
        };

        $scope.setTitle = function (title) {
            $scope.title = title;
        };
        
        $scope.setSpy = function (time) {
            ScrollSpyService.get(time || 0).then(function (response) {
                $scope.nav = response;
            });
        };

        $scope.setValid = function (value) {
            $scope.valid = value;
        };

        $scope.isValid = function () {
            return $scope.valid;
        };

        $scope.setPublished = function (value) {
            $scope.published = value;
            $scope.draft = !value;
        };

        $scope.validate = function () {
            var deferred = $q.defer();

            $scope.setValid(true);
            $scope.$broadcast(CONTROL_EVENTS.initiateValidation);

            if ($scope.isValid()) {
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
                    var restLanguages = _.filter($scope.languages, function (x) { return x.code !== currentLanguage; });
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
            else {
                deferred.resolve(false);
            }

            return deferred.promise;
        };

        $scope.discard = function () {
            $scope.run('loading').then(function () {
                $scope.load().then(function (response) {
                    $scope.run('loaded', [response]).then(function () {
                        $scope.run('setting', [response]).then(function () {
                            $scope.set(response);
                            $scope.run('set', [response]).then(function () {
                                $scope.setSpy(200);
                            }).catch(function (setError) {
                                logger.error(setError);
                            });
                        }).catch(function (settingError) {
                            logger.error(settingError);
                        });
                    }).catch(function (loadedError) {
                        logger.error(loadedError);
                    });
                }).catch(function (loadError) {
                    logger.error(loadError);
                });
            }).catch(function (loadingError) {
                logger.error(loadingError);
            });
        };

        $scope.push = function (data) {
            var deferred = $q.defer();

            throw new Error('not implemented');

            return deferred.promise;
        };

        $scope.publish = function () {
            $scope.run('validating').then(function () {
                $scope.validate().then(function (validationResults) {
                    $scope.run('validated', [validationResults]).then(function () {
                        if (validationResults) {
                            var item = $scope.get();
                            $scope.run('publishing', [item]).then(function () {
                                $scope.push(item).then(function (pushed) {
                                    $scope.run('published', [pushed]).then(function () {
                                        if (pushed) {
                                            if ($scope.isNew()) {
                                                var targetUrl = $scope.current.breadcrumb.items[$scope.current.breadcrumb.items.length - 2].url + '/' + pushed.id;
                                                $location.goto(targetUrl);
                                            }
                                            else {
                                                $scope.set(pushed);
                                            }
                                        }
                                        else {
                                            throw new Error('save unsuccessful');
                                        }
                                    }).catch(function (publishedError) {
                                        logger.error(publishedError);
                                    });
                                }).catch(function (pushError) {
                                    logger.error(pushError);
                                });
                            }).catch(function (publishingError) {
                                logger.error(publishingError);
                            });
                        }
                        else {
                            $scope.scroll2error();
                        }
                    }).catch(function (validatedError) {
                        logger.error(validatedError);
                    });
                }).catch(function (validateError) {
                    logger.error(validateError);
                });

            }).catch(function (validatingError) {
                logger.error(validatingError);
            });

        };

        $scope.$on(CONTROL_EVENTS.valueChanged, function (sender) {
            sender.stopPropagation();

            $scope.published = false;
        });

        $scope.$on(CONTROL_EVENTS.valueIsValid, function (sender, value) {
            sender.stopPropagation();

            if (!value)
                $scope.valid = false;
        });

        $scope.scroll2error = function () {
            setTimeout(function () {
                var firstInvalidControl = $('.ctrl.invalid:visible:first');
                if (firstInvalidControl.length > 0)
                    if (!firstInvalidControl.inViewport())
                        $('body').scrollTo(firstInvalidControl, { offset: -150, duration: 400 });
            }, 100);
        };

        $scope.init = function () {
            var deferred = $q.defer();

            $scope.run('preloading').then(function () {
                $scope.preload().then(function () {                   
                    $scope.run('preloaded').then(function () {
                        $scope.run('loading').then(function () {
                            $scope.load().then(function (response) {
                                $scope.run('loaded', [response]).then(function () {
                                    $scope.run('setting', [response]).then(function () {
                                        $scope.set(response).then(function (setted) {
                                            $scope.run('set', [setted]).then(function () {
                                                $scope.run('watch').then(function () {
                                                    $scope.getBreadcrumb().then(function (breadcrumb) {
                                                        $scope.setBreadcrumb(breadcrumb).then(function () {
                                                            $scope.setSpy(200);
                                                            deferred.resolve(setted);
                                                        }).catch(function (setBreadcrumbError) {
                                                            deferred.reject(setBreadcrumbError);
                                                        });
                                                    }).catch(function (getBreadcrumbError) {
                                                        deferred.reject(getBreadcrumbError);
                                                    });
                                                }).catch(function (watchError) {
                                                    deferred.reject(watchError);
                                                });
                                            }).catch(function (setError) {
                                                deferred.reject(setError);
                                            });
                                        }).catch(function (settedError) {
                                            deferred.reject(settedError);
                                        });                                        
                                    }).catch(function (settingError) {
                                        deferred.reject(settingError);
                                    });
                                }).catch(function (loadedError) {
                                    deferred.reject(loadedError);
                                });
                            }).catch(function (loadError) {
                                deferred.reject(loadError);
                            });
                        }).catch(function (loadingError) {
                            deferred.reject(loadingError);
                        });
                    }, function (preloadedError) {
                        deferred.reject(preloadedError);
                    });
                }).catch(function (preloadError) {
                    deferred.reject(preloadError);
                });
            }).catch(function (preloadingError) {
                deferred.reject(preloadingError);
            });

            return deferred.promise;
        };

    };
    jsnbt.FormControllerBase.prototype = Object.create(jsnbt.ControllerBase.prototype);

})();