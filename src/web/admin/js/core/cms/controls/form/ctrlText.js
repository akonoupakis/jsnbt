/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlText', ['$rootScope', '$timeout', '$q', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, CONTROL_EVENTS) {

            var TextControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));
                
                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-text');
                
                this.init().then(function () {
                    if (scope.ngAutoFocus === true) {
                        setTimeout(function () {
                            element.find('input[type="text"]').focus();
                        }, 200);
                    }
                });
            };
            TextControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            TextControl.prototype.isValid = function () {
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
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngCharacters: '@',
                    ngAutoFocus: '=',
                    ngMaxLength: '='
                }),
                link: function (scope, element, attrs) {
                    return new TextControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlText.html'
            };

        }])
        .directive('ctrlTextAllowed', [function () {

            return {
                restrict: "A",
                link: function ($scope, $element, $attrs) {
                    var chars = ($scope.ngCharacters || '').split('');
                    if (chars.length > 0) {
                        $element.on("keypress", function (event) {
                            var char = String.fromCharCode(event.which);
                            if (chars.indexOf(char) === -1)
                                event.preventDefault();
                        });
                    }
                }
            };

        }]);

})();