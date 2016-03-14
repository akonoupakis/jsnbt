/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.FormControllerBase = (function (FormControllerBase) {

                FormControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, FileService,NodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    var logger = $logger.create('FormControllerBase');

                    $scope.localization = true;

                    this.id = $scope.route && $scope.route.current.params.id;
                    $scope.id = this.id;

                    this.new = $scope.id === 'new' || _.str.startsWith($scope.id, 'new-');
                    $scope.model = undefined;

                    $scope.title = undefined;

                    $scope.valid = true;

                    $scope.validation = { };

                    $scope.published = true;
                    $scope.draft = false;

                    $scope.active = {};

                    $scope.localized = false;
                    $scope.language = '';
                                        
                    this.enqueue('preloaded', '', function () {
                        var deferred = $q.defer();

                        $($scope.languages).each(function (i, item) {
                            $scope.active[item.code] = item.active === true;
                        });

                        deferred.resolve();

                        return deferred.promise;
                    });
                     
                    this.enqueue('watch', '', function () {
                        var deferred = $q.defer();

                        $scope.$watch('title', function (newValue, prevValue) {
                            if (newValue !== prevValue && newValue !== undefined) {
                                self.getBreadcrumb().then(function (breadcrumb) {
                                    self.setBreadcrumb(breadcrumb).catch(function (setBreadcrumbError) {
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
                    
                    $scope.discard = function () {
                        self.discard().catch(function (ex) {
                            logger.error(ex);
                        });
                    };
                    
                    $scope.publish = function () {

                        var reject = function (ex) {
                            logger.error(ex);
                        };

                        self.run('validating').then(function () {
                            self.validate().then(function (validationResults) {
                                self.run('validated', [validationResults]).then(function () {
                                    if (validationResults) {
                                        var item = self.get();
                                        self.run('publishing', [item]).then(function () {
                                            self.push(item).then(function (pushed) {
                                                if (pushed) {
                                                    if (self.isNew()) {
                                                        var currentUrlParts = $scope.route.current.path.split('/');
                                                        currentUrlParts.pop();
                                                        var currentUrl = currentUrlParts.join('/');
                                                        var targetUrl = currentUrl + '/' + pushed.id;
                                                        $scope.route.navigate(targetUrl);
                                                    }
                                                    else {
                                                        self.load().then(function (loaded) {
                                                            self.set(loaded).then(function () {
                                                                self.run('published', [loaded]).catch(reject);
                                                            }).catch(reject);
                                                        }).catch(reject);
                                                    }
                                                }
                                                else {
                                                    self.failed(new Error('save unsuccessful'));
                                                }
                                            }).catch(reject);
                                        }).catch(reject);
                                    }
                                    else {
                                        $scope.scroll2error();
                                    }
                                }).catch(reject);
                            }).catch(reject);
                        }).catch(reject);

                    };


                    $scope.$on(CONTROL_EVENTS.valueChanged, function (sender) {
                        sender.stopPropagation();

                        $scope.published = false;
                    });

                    $scope.scroll2error = function () {
                        setTimeout(function () {
                            var firstInvalidControl = $('.ctrl.invalid:visible:first');
                            if (firstInvalidControl.length > 0)
                                if (!firstInvalidControl.is(':in-viewport'))
                                    $('body').scrollTo(firstInvalidControl, { offset: -150, duration: 400 });
                        }, 100);
                    };
                    
                };
                FormControllerBase.prototype = Object.create(controllers.ControllerBase.prototype);

                FormControllerBase.prototype.isNew = function () {
                    return this.new;
                };

                FormControllerBase.prototype.preload = function () {
                    var deferred = this.ctor.$q.defer();

                    deferred.resolve();

                    return deferred.promise;
                };

                FormControllerBase.prototype.load = function () {
                    throw new Error('not implemented');
                };

                FormControllerBase.prototype.set = function (data) {
                    throw new Error('not implemented');
                };

                FormControllerBase.prototype.get = function () {
                    throw new Error('not implemented');
                };

                FormControllerBase.prototype.setTitle = function (title) {
                    this.scope.title = title;
                };

                FormControllerBase.prototype.setSpy = function (time) {
                    var self = this;

                    this.ctor.ScrollSpyService.get(time || 0).then(function (response) {
                        self.scope.nav = response;
                    });
                };

                FormControllerBase.prototype.setValid = function (value) {
                    this.scope.valid = value;
                };

                FormControllerBase.prototype.isValid = function () {
                    return this.scope.valid;
                };

                FormControllerBase.prototype.setPublished = function (value) {
                    this.scope.published = value;
                    this.scope.draft = !value;
                };

                FormControllerBase.prototype.validate = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;
                    
                    self.setValid(true);

                    _.each(self.controls, function (c) {
                        if (typeof (c.initValidation) === 'function')
                            c.initValidation();
                    });
                    
                    this.ctor.$q.all(_.map(_.filter(self.controls, function (f) { return typeof (f.validate) === 'function'; }), function (x) { return x.validate(); })).then(function (result) {
                        
                        self.setValid(_.all(result, function (x) { return x === true; }));
                        
                        var initialLanguage = self.scope.language;
                        
                        if (self.isValid()) {
                            if (self.scope.localized) {
                                var checkLanguage = function (lang, next) {
                                    self.scope.language = lang.code;

                                    self.ctor.$timeout(function () {

                                        self.ctor.$q.all(_.map(_.filter(self.controls, function (f) { return typeof (f.validate) === 'function'; }), function (x) { return x.validate(); })).then(function (langResult) {
                                            self.setValid(_.all(langResult, function (x) { return x === true; }));

                                            if (!self.scope.valid) {
                                                deferred.resolve(false);
                                            }
                                            else {
                                                next();
                                            }

                                        });
                                        
                                    }, 50);
                                };

                                var currentLanguage = self.scope.language;
                                var restLanguages = _.filter(self.scope.languages, function (x) { return x.code !== currentLanguage; });
                                if (restLanguages.length > 0) {
                                    var nextIndex = 0;
                                    var next = function () {
                                        nextIndex++;

                                        var lang = restLanguages[nextIndex];
                                        if (lang) {
                                            checkLanguage(lang, next);
                                        }
                                        else {
                                            self.scope.language = initialLanguage;
                                            deferred.resolve(true);
                                        }
                                    };

                                    var first = _.first(restLanguages);
                                    checkLanguage(first, next);
                                }
                                else {
                                    self.scope.language = initialLanguage;
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

                    });

                    return deferred.promise;
                };

                FormControllerBase.prototype.discard = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    var reject = function (ex) {
                        deferred.reject(ex);
                    };

                    self.run('loading').then(function () {
                        self.load().then(function (response) {
                            self.run('loaded', [response]).then(function () {
                                self.run('setting', [response]).then(function () {
                                    self.set(response).then(function (setted) {
                                        self.run('set', [response]).then(function () {
                                            self.setValid(true);

                                            _.each(self.controls, function (c) {
                                                if (typeof (c.clearValidation) === 'function')
                                                    c.clearValidation();
                                            })

                                            self.setSpy(200);

                                            deferred.resolve();
                                        }).catch(reject);
                                    }).catch(reject);
                                }).catch(reject);
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);

                    return deferred.promise;
                };

                FormControllerBase.prototype.push = function (data) {
                    var deferred = this.ctor.$q.defer();

                    throw new Error('not implemented');

                    return deferred.promise;
                };

                FormControllerBase.prototype.failed = function (ex) {

                    throw ex;

                };

                FormControllerBase.prototype.init = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    var resolve = function (data) {
                        self.scope.loading = false;
                        deferred.resolve(data);
                    }

                    var reject = function (ex) {
                        self.scope.loading = false;
                        deferred.reject(ex);
                    };

                    controllers.ControllerBase.prototype.init.apply(this, arguments).then(function () {
                        self.scope.loading = true;

                        if (!self.scope.denied) {

                            if (self.scope.application) {
                                self.scope.localized = self.scope.application.localization.enabled;
                                self.scope.language = self.scope.application.localization.enabled ? (self.scope.defaults.language ? self.scope.defaults.language : (_.first(self.scope.application.languages) || {}).code) : self.scope.defaults.language;
                            }

                            self.run('preloading').then(function () {
                                self.preload().then(function () {
                                    self.run('preloaded').then(function () {
                                        self.run('loading').then(function () {
                                            self.load().then(function (response) {
                                                self.scope.found = true;
                                                self.run('loaded', [response]).then(function () {
                                                    self.run('setting', [response]).then(function () {
                                                        self.set(response).then(function (setted) {
                                                            self.run('set', [setted]).then(function () {
                                                                self.run('watch').then(function () {
                                                                    self.getBreadcrumb().then(function (breadcrumb) {
                                                                        self.setBreadcrumb(breadcrumb).then(function () {
                                                                            self.setSpy(200);
                                                                            resolve(setted);
                                                                        }).catch(reject);
                                                                    }).catch(reject);
                                                                }).catch(reject);
                                                            }).catch(reject);
                                                        }).catch(reject);
                                                    }).catch(reject);
                                                }).catch(reject);
                                            }).catch(function (loadError) {
                                                var parsedLoadError = _.isString(loadError) ? JSON.parse(loadError) : loadError;
                                                if (_.isObject(parsedLoadError) && parsedLoadError.statusCode === 404) {
                                                    self.scope.found = false;
                                                    resolve();
                                                }
                                                else {
                                                    reject(loadError);
                                                }
                                            });
                                        }).catch(reject);
                                    }).catch(reject);
                                }).catch(reject);
                            }).catch(reject);
                        }
                        else {
                            self.scope.loading = false;
                            deferred.resolve();
                        }

                    }).catch(reject);

                    return deferred.promise;
                };

                FormControllerBase.prototype.getBreadcrumb = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    controllers.ControllerBase.prototype.getBreadcrumb.apply(this, arguments).then(function (breadcrumb) {

                        if (self.scope.breadcrumb) {
                            if (self.isNew()) {
                                breadcrumb[breadcrumb.length - 1].name = 'new';
                            } else {
                                breadcrumb[breadcrumb.length - 1].name = self.scope.title;
                            }
                        }

                        deferred.resolve(breadcrumb);

                    }).catch(function (ex) {
                        deferred.reject(ex);
                    });

                    return deferred.promise;
                };

                return FormControllerBase;

            })(controllers.FormControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();