/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlNode', ['$rootScope', '$timeout', '$data', '$fn', 'CONTROL_EVENTS', function ($rootScope, $timeout, $data, $fn, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    language: '=',
                    ngModel: '=',
                    ngDomain: '=',
                    ngOptions: '=',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngValidating: '=',
                    ngChangeFn: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-node');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.value = '';
                    scope.valid = true;
                    scope.wrong = false;
                    scope.missing = false;

                    var initiated = false;

                    scope.$watch('ngDisabled', function (newValue) {
                        if (initiated)
                            scope.valid = isValid();
                    });
                    
                    scope.$watch('ngValidating', function (newValue) {
                        if (initiated)
                            if (newValue === false)
                                scope.valid = true;
                            else
                                scope.valid = isValid();
                    });

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

                    var isValid = function () {
                        var valid = true;

                        var validating = scope.ngValidating !== false;
                        if (validating && !scope.ngDisabled && element.is(':visible')) {

                            if (valid) {
                                if (scope.ngRequired) {
                                    if (!scope.ngModel) {
                                        valid = false;
                                    }
                                    else if (!_.isString(scope.ngModel)) {
                                        valid = false;
                                    }
                                    else if (scope.ngModel === '') {
                                        valid = false;
                                    }
                                }

                                if (scope.ngModel) {
                                    if (!_.isString(scope.ngModel))
                                        valid = false;
                                    else if (scope.wrong && scope.missing)
                                        valid = false;
                                }
                            }

                        }

                        return valid;
                    };
       
                    scope.$watch('ngModel', function (newValue, prevValue) {
                        if (newValue) {
                            if (_.isString(newValue)) {
                                if (newValue !== '') {
                                    $data.nodes.get({
                                        id: newValue,
                                        domain: scope.ngDomain
                                    }).then(function (response) {
                                        scope.value = response.title[scope.language];
                                        scope.wrong = false;
                                        scope.missing = false;

                                        if (initiated)
                                            scope.valid = isValid();
                                    }).catch(function (error) {
                                        scope.value = newValue;
                                        scope.wrong = true;
                                        scope.missing = true;

                                        if (initiated)
                                            scope.valid = isValid();
                                    });
                                }
                                else {
                                    scope.value = '';
                                    scope.wrong = false;
                                    scope.missing = false;

                                    if (initiated)
                                        scope.valid = isValid();
                                }
                            }
                            else {
                                scope.value = '';
                                scope.wrong = true;
                                scope.missing = false;

                                if (initiated)
                                    scope.valid = isValid();
                            }
                        }
                        else {
                            scope.value = '';
                            scope.wrong = false;
                            scope.missing = false;

                            if (initiated)
                                scope.valid = isValid();
                        }
                    });

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });
                    
                    scope.$on(CONTROL_EVENTS.validate, function (sender) {
                        if (initiated) {
                            scope.valid = isValid();
                        }
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });

                    scope.$on(CONTROL_EVENTS.clearValidation, function (sender) {
                        initiated = false;
                        scope.valid = true;
                    });

                    scope.select = function () {
                        if (!scope.ngDomain || scope.ngDomain === '')
                            return;

                        var invoked = $fn.invoke(scope.ngDomain, 'selectNode', [scope.ngDomain, scope.ngModel, scope.ngOptions], true);
                        if (invoked) {
                            invoked.then(function (selectedNodeId) {
                                scope.ngModel = selectedNodeId || '';
                                scope.changed();
                            }).catch(function (error) {
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

        }]);

})();