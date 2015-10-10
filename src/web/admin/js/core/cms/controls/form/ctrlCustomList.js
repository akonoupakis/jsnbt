/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlCustomList', ['$rootScope', '$timeout', '$q', 'ModalService', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, ModalService, CONTROL_EVENTS) {

            var CustomListControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                this.defaultValue = [];

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

                scope.sortableOptions = {
                    axis: 'v',

                    handle: '.glyphicon-move',
                    cancel: '',
                    containment: "parent",

                    stop: function (e, ui) {
                        scope.ngModel = scope.ngModel.map(function (x) {
                            return x;
                        });
                        scope.changed();
                    }
                };

                this.init();
            };
            CustomListControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            CustomListControl.prototype.isValid = function () {
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
                    }

                    deferred.resolve(valid);
                });

                return deferred.promise;
            };

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngScope: '='
                }),
                link: function (scope, element, attrs) {
                    return new CustomListControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlCustomList.html'
            };

        }]);

})();