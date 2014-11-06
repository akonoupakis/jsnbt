/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlNode', function ($timeout, $data, $fn, FORM_EVENTS) {

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
                    scope.enabled = scope.ngEnabled !== undefined ? scope.ngEnabled : true;

                    var initiated = false;

                    scope.$watch('ngEnabled', function (newValue) {
                        scope.enabled = newValue !== undefined ? newValue : true;

                        if (initiated)
                            scope.valid = isValid();
                    });
                    
                    scope.changed = function () {
                        $timeout(function () {
                            scope.$emit(FORM_EVENTS.valueChanged, scope.ngModel);
                        }, 50);
                    };

                    var isValid = function () {
                        var valid = true;

                        if (scope.enabled) {

                            if (valid) {
                                if (scope.ngRequired) {
                                    valid = !!scope.ngModel && scope.ngModel !== '';
                                }
                            }

                        }

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) { 
                        if (newValue && newValue !== '') {
                            $data.nodes.get(newValue).then(function (response) {
                                scope.value = response.name;

                                if (initiated)
                                    scope.valid = isValid();
                            }, function (error) {
                                
                                if (initiated)
                                    scope.valid = isValid();

                                throw error;
                            });
                        }
                        else {
                            scope.value = '';

                            if (initiated)
                                scope.valid = isValid();
                        }
                    });

                    scope.$on(FORM_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(FORM_EVENTS.valueIsValid, scope.valid);
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
                templateUrl: 'tmpl/core/partial/controls/ctrlNode.html'
            };

        });

})();