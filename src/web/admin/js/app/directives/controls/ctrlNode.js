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
                    ngLabel: '@'
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-node');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.initiated = false;
                    scope.value = '';
                    
                    scope.changed = function () {
                        $timeout(function () {
                            scope.$emit(FORM_EVENTS.valueChanged, scope.ngModel);
                        }, 50);
                    };

                    var isValid = function () {
                        var valid = true;

                        if (scope.ngEnabled === false)
                            valid = true;

                        if (valid) {
                            if (scope.ngRequired) {
                                valid = !!scope.ngModel && scope.ngModel !== '';
                            }
                        }

                        if (!valid)
                            element.addClass('invalid');
                        else
                            element.removeClass('invalid');

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) { 
                        if (newValue && newValue !== '') {
                            $data.nodes.get(newValue).then(function (response) {
                                scope.value = response.name;
                            }, function (error) {
                                throw error;
                            });
                        }
                        else {
                            scope.value = '';
                        }
                    });

                    scope.$on(FORM_EVENTS.initiateValidation, function (sender) {
                        scope.initiated = true;
                        scope.$emit(FORM_EVENTS.valueIsValid, isValid());
                    });

                    scope.isValid = function () {
                        return isValid();
                    };

                    scope.select = function () {
                        if (!scope.ngDomain || scope.ngDomain === '')
                            return;

                        var invoked = $fn.invoke(scope.ngDomain, 'node.select', [scope.ngModel, scope.ngOptions], false);
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
                templateUrl: 'tmpl/partial/controls/ctrlNode.html' 
            };

        });

})();