/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlTags', ['$rootScope', '$timeout', '$q', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, CONTROL_EVENTS) {

            var TagsControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));
                
                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-tags');
                
                scope.model = [];

                var initiated = false;
                var changing = false;

                scope.$watch('ngModel', function (newValue) {                    
                    if (!_.isEqual(scope.model, _.map(newValue, function (x) { return { text: x }; }))) {
                        changing = true;
                        scope.model = _.map(newValue, function (x) { return { text: x }; });
                        setTimeout(function () {
                            changing = false;
                        }, 300);
                    }
                }, true);

                scope.$watch('model', function (newValue) {
                    if (initiated && !_.isEqual(scope.ngModel, _.map(newValue, function (x) { return x.text; }))) {
                        scope.ngModel = _.map(newValue, function (x) { return x.text; });

                        if (!changing) {
                            scope.changed();
                            self.validate();
                        }
                    }
                }, true);

                this.init().then(function () {
                    setTimeout(function () {
                        initiated = true;
                    }, 100);

                    if (scope.ngAutoFocus === true) {
                        setTimeout(function () {
                            element.find('tags input').focus();
                        }, 200);
                    }
                });
            };
            TagsControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            TagsControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {
                        if (self.scope.ngRequired) {
                            if (self.scope.model.length === 0) {
                                valid = false;
                            }
                        }
                    }

                    self.scope.valid = valid;
                    deferred.resolve(valid);
                });
                
                return deferred.promise;
            };

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngAutoFocus: '=',
                    ngPlaceholder: '@'
                }),
                link: function (scope, element, attrs) {
                    var control = new TagsControl(scope, element, attrs);
                    scope.$emit(CONTROL_EVENTS.register, control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlTags.html'
            };

        }]);

})();