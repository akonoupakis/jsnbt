/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlNode', function ($timeout, $data, $fn) {

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
                    scope.value = '';
                    
                    scope.changed = function () {
                        $timeout(function () {
                            scope.$emit('changed', scope.ngModel);
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

                    scope.$on('validate', function (sender) {
                        scope.$emit('valid', isValid());
                    });

                    scope.isValid = function () {
                        return isValid();
                    };

                    scope.select = function () {
                        if (!scope.ngDomain || scope.ngDomain === '')
                            return;

                        $fn.invoke(scope.ngDomain, 'node.select', [scope.ngModel, scope.ngOptions], false).then(function (selectedNodeId) {
                            scope.ngModel = selectedNodeId || '';
                            scope.changed();
                        }, function (error) {
                            throw error;
                        });
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