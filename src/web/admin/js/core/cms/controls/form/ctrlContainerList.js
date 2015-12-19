/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlContainerList', ['$rootScope', '$timeout', '$jsnbt', '$q', 'ModalService', 'CONTROL_EVENTS', function ($rootScope, $timeout, $jsnbt, $q, ModalService, CONTROL_EVENTS) {

            var ContainerListControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-container-list');

                scope.value = [];

                scope.faulty = false;

                scope.faults.empty = false;
                scope.faults.exceeded = false;

                scope.invalid = {};
                scope.wrong = {};
                scope.missing = {};
                
                scope.$watch('ngModel', function (newValue, prevValue) {
                    if (newValue) {
                        if (_.isArray(newValue)) {

                            scope.wrong = {};
                            scope.missing = {};

                            var scopeValues = [];

                            $(newValue).each(function (nv, nValue) {
                                if (_.isString(nValue)) {

                                    scope.wrong[nv] = false;

                                    var selectedContainer = $jsnbt.containers[nValue];

                                    if (selectedContainer) {
                                        scopeValues.push({
                                            id: nValue,
                                            name: selectedContainer.name
                                        });
                                    }
                                    else {
                                        scopeValues.push({
                                            id: nValue,
                                            name: nValue
                                        });
                                    }

                                    if (!selectedContainer)
                                        scope.missing[nv] = true;
                                }
                                else {
                                    scopeValues.push({
                                        id: nValue,
                                        name: nValue
                                    });

                                    scope.wrong[nv] = true;
                                }
                            });

                            scope.value = scopeValues;

                            self.validate();
                        }
                        else {
                            scope.wrong = {};
                            scope.missing = {};
                            scope.value = [];

                            self.validate();
                        }
                    }
                    else {
                        scope.wrong = {};
                        scope.missing = {};
                        scope.value = [];

                        self.validate();
                    }
                });
                
                scope.edit = function (index) {
                    var item = scope.ngModel[index];

                    ModalService.select(function (x) {
                        x.title('select the container item you want');
                        x.controller('ContainerSelectorController');
                        x.template('tmpl/core/modals/containerSelector.html');
                        x.scope({
                            selected: item,
                            mode: 'single'
                        });
                    }).then(function (result) {
                        scope.ngModel[index] = result;
                        scope.ngModel = scope.ngModel.slice(0);

                        self.validate();

                        scope.changed();
                    });
                };

                scope.add = function () {
                    ModalService.select(function (x) {
                        x.title('select the container items you want');
                        x.controller('ContainerSelectorController');
                        x.template('tmpl/core/modals/containerSelector.html');
                        x.scope({
                            mode: 'multiple'
                        });
                    }).then(function (results) {
                        if (!scope.ngModel)
                            scope.ngModel = [];

                        $(results).each(function (i, item) {
                            scope.ngModel.push(item);
                        });

                        scope.ngModel = scope.ngModel.slice(0);

                        self.validate();

                        scope.changed();
                    });
                };

                scope.clear = function (index) {
                    var newValue = [];

                    $(scope.ngModel).each(function (i, item) {
                        if (i !== index) {
                            newValue.push(item);
                        }
                    });

                    scope.ngModel = newValue;
                    scope.changed();
                };

                scope.sortableOptions = {
                    axis: 'v',

                    handle: '.glyphicon-move',
                    cancel: '',
                    containment: "parent",

                    stop: function (e, ui) {
                        var nodeIds = scope.value.map(function (x) {
                            return x.id;
                        });

                        if (!_.isEqual(nodeIds, scope.ngModel)) {
                            scope.ngModel = nodeIds;
                            scope.changed();
                        }
                    }
                };

                this.init();
            };
            ContainerListControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            ContainerListControl.prototype.isValid = function () {
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
                                    else if (self.scope.wrong[i] && self.scope.missing[i]) {
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
                    ngMaxLength: '='
                }),
                link: function (scope, element, attrs) {
                    var control = new ContainerListControl(scope, element, attrs);
                    scope.$emit(CONTROL_EVENTS.register, control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlContainerList.html'
            };

        }]);

})();