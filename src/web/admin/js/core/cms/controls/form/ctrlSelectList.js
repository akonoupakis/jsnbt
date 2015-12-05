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

                scope.empty = false;

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
                                else if (!_.any(scope.ngOptions, function (x) {
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

                self.scope.empty = false;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {
                        
                        if (self.scope.ngRequired) {
                            if (!self.scope.ngModel) {
                                valid = false;
                                self.scope.empty = true;
                            }
                            else if (!_.isArray(self.scope.ngModel)) {
                                valid = false;
                            }
                            else if (self.scope.ngModel.length === 0) {
                                valid = false;
                                self.scope.empty = true;
                            }
                        }

                        if (self.scope.ngModel) {
                            if (!_.isArray(self.scope.ngModel))
                                valid = false;
                            else {

                                $(self.scope.ngModel).each(function (i, item) {
                                    self.scope.invalid[i] = false;
                                    if (!item) {
                                        valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                    else if (!_.isString(item)) {
                                        valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                    else if (!_.any(self.scope.ngOptions, function (x) {
                                           return x[self.scope.valueField] === item;
                                    })) {
                                        valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                });

                            }
                        }

                    }

                    deferred.resolve(valid);
                });

                return deferred.promise;
            };

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngOptions: '=',
                    ngDefault: '=',
                    ngValueField: '@',
                    ngNameField: '@'
                }),
                link: function (scope, element, attrs) {
                    return new SelectListControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlSelectList.html'
            };

        }]);

})();