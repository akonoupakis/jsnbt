﻿/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlSelect', function ($timeout) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngEnabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngOptions: '=',
                    ngDefault: '=',
                    ngValueField: '@',
                    ngNameField: '@',
                    ngValidate: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-select');

                    scope.valueField = scope.ngValueField ? scope.ngValueField : 'value';
                    scope.nameField = scope.ngNameField ? scope.ngNameField : 'name';
                    
                    scope.id = Math.random().toString().replace('.', '');

                    scope.changed = function () {
                        $timeout(function () { 
                            scope.$emit('changed', scope.ngModel);
                        }, 50);
                    };

                    var isValid = function () {
                        var valid = true;

                        if (scope.ngEnabled === undefined || scope.ngEnabled === true) {
                            if (scope.ngRequired) {
                                valid = !!scope.ngModel && scope.ngModel !== '';
                            }

                            scope.notFound = false;
                            if (valid) {
                                var option = _.first(_.filter(scope.ngOptions, function (x) { return x[scope.valueField] === scope.ngModel; }));
                                if (!option) {
                                    valid = false;
                                    scope.notFound = true;
                                }
                            }

                            if (valid) {
                                if (scope.ngValidate) {
                                    valid = scope.ngValidate(scope.ngModel);
                                }
                            }
                        }

                        if (!valid)
                            element.addClass('invalid');
                        else
                            element.removeClass('invalid');

                        return valid;
                    };

                    scope.$on('validate', function (sender) {
                        scope.$emit('valid', isValid());
                    });

                    scope.isValid = function () {
                        return isValid();
                    };

                },
                templateUrl: 'tmpl/partial/controls/ctrlSelect.html' 
            };

        });

})();