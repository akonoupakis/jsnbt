/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlContainer', ['$rootScope', '$timeout', '$q', '$jsnbt', 'ModalService', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, $jsnbt, ModalService, CONTROL_EVENTS) {

            var ContainerControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-container');

                scope.value = '';
                scope.wrong = false;
                scope.missing = false;
                                
                scope.$watch('ngModel', function (newValue, prevValue) {
                    if (newValue) {
                        if (_.isString(newValue)) {
                            if (newValue !== '') {

                                var selectedContainer = $jsnbt.containers[newValue];

                                if (selectedContainer) {
                                    scope.value = selectedContainer.name;
                                    scope.wrong = false;
                                    scope.missing = false;
                                }
                                else {
                                    scope.value = newValue;
                                    scope.wrong = true;
                                    scope.missing = true;
                                }

                                self.validate();
                            }
                        }
                        else {
                            scope.value = '';
                            scope.wrong = true;
                            scope.missing = false;

                            self.validate();
                        }
                    }
                    else {
                        scope.value = '';
                        scope.wrong = false;
                        scope.missing = false;

                        self.validate();
                    }
                });

                scope.select = function () {
                    ModalService.open(function(x) {
                        x.title('select a container item');
                        x.controller('ContainerSelectorController');
                        x.template('tmpl/core/modals/containerSelector.html');
                        x.maximized();
                        x.scope({
                            selected: scope.ngModel,
                            mode: 'single'
                        });
                    }).then(function (result) {
                        scope.ngModel = result || '';
                        scope.changed();
                    });
                };

                scope.clear = function () {
                    scope.ngModel = '';
                    scope.changed();
                };

                this.init();
            };
            ContainerControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            ContainerControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {
                        if (self.scope.ngRequired) {
                            if (!self.scope.ngModel)
                                self.scope.valid = false;
                            else if (!_.isString(self.scope.ngModel))
                                self.scope.valid = false;
                            else if (self.scope.ngModel === '')
                                self.scope.valid = false;
                        }

                        if (self.scope.ngModel) {
                            if (!_.isString(self.scope.ngModel))
                                self.scope.valid = false;
                            else if (self.scope.wrong && self.scope.missing)
                                self.scope.valid = false;
                        }
                    }

                    deferred.resolve(self.scope.valid);
                });

                return deferred.promise;
            };

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                }),
                link: function (scope, element, attrs) {
                    var control = new ContainerControl(scope, element, attrs);
                    scope.$emit(CONTROL_EVENTS.register, control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlContainer.html'
            };

        }]);

})();