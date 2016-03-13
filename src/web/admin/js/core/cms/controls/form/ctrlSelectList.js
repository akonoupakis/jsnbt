/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlSelectList', ['$rootScope', '$timeout', '$q', 'ModalService', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, ModalService, CONTROL_EVENTS) {

            var SelectListControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-select-list');

                scope.valueField = scope.ngValueField ? scope.ngValueField : 'value';
                scope.nameField = scope.ngNameField ? scope.ngNameField : 'name';

                scope.faulty = false;

                scope.faults.empty = false;
                scope.faults.exceeded = false;

                scope.invalid = {};
                scope.wrong = {};

                scope.$watch('ngModel', function (newValue, prevValue) {
                    if (newValue) {
                        if (_.isArray(newValue)) {
                            scope.wrong = {};
                            scope.value = newValue;
                            $(newValue).each(function (i, item) {
                                scope.wrong[i] = false;

                                if (!item) {
                                    scope.wrong[i] = true;
                                }
                                else if (typeof (item) !== 'string') {
                                    scope.wrong[i] = true;
                                }
                                else if (!_.any(scope.ngItems, function (x) {
                                    return x[scope.valueField] === item;
                                })) {
                                    scope.wrong[i] = true;
                                }
                            });
                        }
                        else {
                            scope.wrong = {};
                            scope.value = [];
                        }
                    }
                    else {
                        scope.wrong = {};
                        scope.value = [];
                    }

                    self.validate();

                }, true);

                scope.add = function () {
                    if (!scope.ngModel)
                        scope.ngModel = [];

                    scope.ngModel.push('');

                    self.validate();

                    scope.changed();
                };

                scope.clear = function (index) {
                    scope.ngModel.splice(index, 1);
                    scope.changed();
                };

                var currentModel = null;
                scope.sortableOptions = {
                    axis: 'v',

                    handle: '.glyphicon-move',
                    cancel: '',
                    containment: "parent",

                    start: function () {
                        currentModel = _.clone(scope.ngModel);
                    },
                    stop: function (e, ui) {
                        if (!_.isEqual(scope.ngModel, currentModel)) {
                            scope.ngModel = scope.ngModel.map(function (x) {
                                return x;
                            });
                            scope.changed();
                        }
                    }
                };

                this.init();
            };
            SelectListControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            SelectListControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                this.scope.faulty = false;
                this.scope.faults.empty = false;
                this.scope.faults.exceeded = false;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {
                        
                        if (self.scope.ngRequired) {
                            if (!self.scope.ngModel) {
                                self.scope.valid = false;
                                self.scope.faults.empty = true;
                            }
                            else if (!_.isArray(self.scope.ngModel)) {
                                self.scope.valid = false;
                            }
                            else if (self.scope.ngModel.length === 0) {
                                self.scope.valid = false;
                                self.scope.faults.empty = true;
                            }
                        }

                        if (self.scope.ngModel) {
                            if (!_.isArray(self.scope.ngModel))
                                self.scope.valid = false;
                            else {

                                $(self.scope.ngModel).each(function (i, item) {
                                    self.scope.invalid[i] = false;
                                    if (!item) {
                                        self.scope.valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                    else if (!_.isString(item)) {
                                        self.scope.valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                    else if (!_.any(self.scope.ngItems, function (x) {
                                           return x[self.scope.valueField] === item;
                                    })) {
                                        self.scope.valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                });

                                if (self.scope.ngMaxLength !== undefined) {
                                    var maxLength = parseInt(self.scope.ngMaxLength);
                                    if (!isNaN(maxLength) && self.scope.ngModel.length > maxLength) {
                                        self.scope.valid = false;
                                        self.scope.faults.exceeded = true;
                                    }
                                }
                            }
                        }

                    }

                    if (self.scope.faults.empty || self.scope.faults.exceeded)
                        self.scope.faulty = true;

                    deferred.resolve(self.scope.valid);
                });

                return deferred.promise;
            };

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngItems: '=',
                    ngDefault: '=',
                    ngValueField: '@',
                    ngNameField: '@',
                    ngMaxLength: '='
                }),
                link: function (scope, element, attrs) {
                    var control = new SelectListControl(scope, element, attrs);
                    scope.$emit(CONTROL_EVENTS.register, control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlSelectList.html'
            };

        }]);

})();