/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controls = (function (controls) {

            controls.FormControlBase = (function (FormControlBase) {

                FormControlBase = function (scope, element, attrs, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
                    controls.ControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                    var self = this;

                    this.defaultValue = undefined;
                    
                    scope.id = Math.random().toString().replace('.', '');                    
                    scope.valid = true;

                    this.initiated = false;
                    this.validated = false;

                    scope.changed = function () {
                        if (scope.ngChangeFn) {
                            if (typeof (scope.ngChangeFn) === 'function') {
                                scope.ngChangeFn(scope.ngModel);
                            }
                        }
                        else {
                            $timeout(function () {
                                scope.$emit(CONTROL_EVENTS.valueChanged, scope.ngModel);
                            }, 50);
                        }
                    };

                    scope.$watch('ngValid', function (newValue) {
                        if (self.initiated && self.validated) {
                            if (newValue === false)
                                self.setValid(false);
                            else
                                self.validate();
                        }
                    });

                    scope.$watch('ngDisabled', function (newValue) {
                        self.validate();
                    });

                    scope.$watch('ngValidating', function (newValue) {
                        if (self.initiated && self.validated) {
                            if (newValue === false)
                                self.setValid(true);
                            else
                                self.validate();
                        }
                    });

                    scope.$watch('ngModel', function (newValue) {
                        if (newValue === undefined && self.defaultValue !== undefined)
                            scope.ngModel = self.defaultValue;

                        self.validate();
                    }, true);

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        if (!self.initiated) {
                            scope.$emit(CONTROL_EVENTS.valueIsValid, false);
                        }
                        else {
                            self.validated = true;

                            self.validate();

                            scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                        }
                    });

                    scope.$on(CONTROL_EVENTS.validate, function (sender) {
                        self.validate();

                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });

                    scope.$on(CONTROL_EVENTS.clearValidation, function (sender) {
                        self.clear();
                    });
                };
                FormControlBase.prototype = Object.create(controls.ControlBase.prototype);
                
                FormControlBase.prototype.properties = $.extend(true, controls.ControlBase.prototype.properties, {
                    ngModel: '=',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngValidating: '=',
                    ngValidate: '=',
                    ngValid: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngChangeFn: '='
                });

                FormControlBase.prototype.init = function (time) {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    if (time) {
                        this.ctor.$timeout(function () {
                            self.initiated = true;
                            deferred.resolve();
                        }, time);
                    }
                    else {
                        this.initiated = true;
                        deferred.resolve();
                    }

                    return deferred.promise;
                };

                FormControlBase.prototype.isVisible = function () {
                    return this.element.is(':visible');
                };

                FormControlBase.prototype.isEnabled = function () {
                    return this.scope.ngDisabled !== true;
                };

                FormControlBase.prototype.isValidating = function () {
                    return this.scope.ngValidating !== false && this.isEnabled() && this.isVisible();
                };

                FormControlBase.prototype.isValid = function () {
                    var deferred = this.ctor.$q.defer();

                    var valid = true;

                    deferred.resolve(valid);

                    return deferred.promise;
                };

                FormControlBase.prototype.setValid = function (value) {
                    this.scope.valid = value;
                };

                FormControlBase.prototype.validate = function () {
                    var self = this;

                    if (this.initiated && this.validated) {
                        this.isValid().then(function (valid) {
                            self.setValid(valid);

                            if (self.isValidating()) {
                                if (valid) {
                                    var validInternal = true;
                                    if (typeof (self.scope.ngValidate) === 'function') {
                                        validInternal = self.scope.ngValidate(self.scope.ngModel);
                                    }

                                    if (validInternal && self.scope.ngValid === false)
                                        validInternal = false;

                                    if (!validInternal)
                                        self.setValid(validInternal);
                                }
                            }
                        });
                    }
                    else {
                        this.setValid(true);
                    }
                };

                FormControlBase.prototype.clear = function () {
                    this.validated = false;
                    this.setValid(true);
                };

                return FormControlBase;

            })(controls.FormControlBase || {});

            return controls;

        })(jsnbt.controls || {});

        return jsnbt;

    })(jsnbt || {});

})();