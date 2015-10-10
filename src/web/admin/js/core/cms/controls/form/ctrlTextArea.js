/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlTextArea', ['$rootScope', '$timeout', '$q', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, CONTROL_EVENTS) {

            var TextAreaControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-text-area');

                this.init().then(function () {
                    if (scope.ngAutoFocus === true) {
                        setTimeout(function () {
                            element.find('textarea').focus();
                        }, 200);
                    }
                });
            };
            TextAreaControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            TextAreaControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {
                        if (self.scope.ngRequired) {
                            if (!self.scope.ngModel) {
                                valid = false;
                            }
                            else {
                                valid = !!self.scope.ngModel && self.scope.ngModel !== '';
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
                scope: {
                    ngModel: '=',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngRows: '=',
                    ngValidating: '=',
                    ngValidate: '=',
                    ngValid: '=',
                    ngAutoFocus: '=',
                    ngMaxLength: '=',
                    ngChangeFn: '='
                },
                link: function (scope, element, attrs) {
                    return new TextAreaControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlTextArea.html'
            };

        }]);

})();