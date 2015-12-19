/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlCustomList', ['$rootScope', '$timeout', '$q', 'ModalService', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, ModalService, CONTROL_EVENTS) {

            var CustomListControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                this.defaultValue = [];

                scope.faulty = false;

                scope.faults.empty = false;
                scope.faults.exceeded = false;

                element.addClass('ctrl');
                element.addClass('ctrl-custom-list');
                                
                if (_.isObject(scope.ngScope)) {
                    for (var contextName in scope.ngScope) {
                        scope[contextName] = scope.ngScope[contextName];
                    }
                }

                scope.$watch('ngScope', function (newValue, prevValue) {
                    if (_.isObject(newValue)) {
                        for (var contextName in newValue) {
                            scope[contextName] = newValue[contextName];
                        }
                    }
                }, true);
                
                scope.add = function () {
                    scope.ngModel.push({});

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
            CustomListControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            CustomListControl.prototype.isValid = function () {
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
                            if (self.scope.ngMaxLength !== undefined) {
                                var maxLength = parseInt(self.scope.ngMaxLength);
                                if (!isNaN(maxLength) && self.scope.ngModel.length > maxLength) {
                                    self.scope.valid = false;
                                    self.scope.faults.exceeded = true;
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
                transclude: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngScope: '=',
                    ngMaxLength: '='
                }),
                link: function (scope, element, attrs) {
                    var control = new CustomListControl(scope, element, attrs);
                    scope.$emit(CONTROL_EVENTS.register, control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlCustomList.html'
            };

        }]);

})();