/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlNode', function ($timeout, $data, $fn, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDomain: '=',
                    ngOptions: '=',
                    ngEnabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@'
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-node');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.value = '';
                    scope.valid = true;
                    scope.wrong = false;
                    scope.enabled = scope.ngEnabled !== undefined ? scope.ngEnabled : true;

                    var initiated = false;

                    scope.$watch('ngEnabled', function (newValue) {
                        scope.enabled = newValue !== undefined ? newValue : true;

                        if (initiated)
                            scope.valid = isValid();
                    });
                    
                    scope.changed = function () {
                        $timeout(function () {
                            scope.$emit(CONTROL_EVENTS.valueChanged, scope.ngModel);
                        }, 50);
                    };

                    var isValid = function () {
                        var valid = true;

                        if (scope.enabled) {

                            if (valid) {
                                if (scope.ngRequired) {
                                    if (!scope.ngModel)
                                        valid = false;
                                    else if (typeof (scope.ngModel) !== 'string')
                                        valid = false;
                                    else if (scope.ngModel === '')
                                        valid = false;
                                }

                                if (scope.ngModel) {
                                    if (typeof (scope.ngModel) !== 'string')
                                        valid = false;
                                }
                            }

                        }

                        return valid;
                    };
       
                    scope.$watch('ngModel', function (newValue, prevValue) {
                        if (newValue && newValue !== '') {
                            $data.nodes.get(newValue).then(function (response) {
                                scope.value = response.name;
                                scope.wrong = false;

                                if (initiated)
                                    scope.valid = isValid();
                            }, function (error) {
                                scope.value = newValue;
                                scope.wrong = true;

                                if (initiated)
                                    scope.valid = isValid();

                                throw error;
                            });
                        }
                        else {
                            scope.value = '';
                            scope.wrong = false;

                            if (initiated)
                                scope.valid = isValid();
                        }
                    });

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });
                    
                    scope.select = function () {
                        if (!scope.ngDomain || scope.ngDomain === '')
                            return;

                        var invoked = $fn.invoke(scope.ngDomain, 'selectNode', [scope.ngDomain, scope.ngModel, scope.ngOptions], true);
                        if (invoked) {
                            invoked.then(function (selectedNodeId) {
                                scope.ngModel = selectedNodeId || '';
                                scope.changed();
                            }, function (error) {
                                throw error;
                            });
                        }
                        else {
                            throw new Error('unable to select node for domain: ' + scope.ngDomain);
                        }
                    };

                    scope.clear = function () {
                        scope.ngModel = '';
                        scope.changed();
                    };

                },
                templateUrl: 'tmpl/core/controls/ctrlNode.html'
            };

        });

})();