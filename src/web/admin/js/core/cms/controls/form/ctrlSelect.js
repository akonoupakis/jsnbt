/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlSelect', ['$rootScope', '$timeout', '$q', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, CONTROL_EVENTS) {

            var SelectControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-select');

                scope.valueField = scope.ngValueField ? scope.ngValueField : 'value';
                scope.nameField = scope.ngNameField ? scope.ngNameField : 'name';
                
                this.init().then(function () {
                    if (scope.ngAutoFocus === true) {
                        setTimeout(function () {
                            element.find('select').focus();
                        }, 200);
                    }
                });
            };
            SelectControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            SelectControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {

                        if (self.scope.ngRequired) {
                            valid = !!self.scope.ngModel && self.scope.ngModel !== '';
                        }

                        self.scope.notFound = false;
                        if (valid && self.scope.ngModel !== undefined) {
                            var option = _.first(_.filter(self.scope.ngOptions, function (x) { return x[self.scope.valueField] === self.scope.ngModel; }));
                            if (!option) {
                                valid = false;
                                scope.notFound = true;
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
                    ngOptions: '=',
                    ngDefault: '=',
                    ngValueField: '@',
                    ngNameField: '@',
                    ngAutoFocus: '='
                }),
                link: function (scope, element, attrs) {
                    return new SelectControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlSelect.html'
            };

        }]);

})();