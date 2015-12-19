/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlFile', ['$rootScope', '$timeout', '$q', 'ModalService', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, ModalService, CONTROL_EVENTS) {

            var FileControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-file');

                scope.value = '';
                scope.wrong = false;
                
                var fileGroup = scope.ngFileGroup ? scope.ngFileGroup : 'public';

                scope.$watch('ngModel', function (newValue, prevValue) {
                    if (newValue) {
                        if (_.isString(newValue)) {
                            scope.value = newValue;
                            scope.wrong = false;
                        }
                        else {
                            scope.wrong = true;
                            scope.value = '';
                        }
                    }
                    else {
                        scope.value = '';
                        scope.wrong = false;
                    }

                    self.validate();
                });
                
                scope.select = function () {
                    ModalService.select(function (x) {
                        x.title('select a file');
                        x.controller('FileSelectorController');
                        x.template('tmpl/core/modals/fileSelector.html');
                        x.scope({
                            selected: scope.ngModel,
                            group: fileGroup,
                            mode: 'single',
                            extensions: scope.ngExtensions || []
                        });
                    }).then(function (result) {
                        scope.ngModel = result;
                        scope.changed();
                    });
                };

                scope.clear = function () {
                    scope.ngModel = '';
                    scope.changed();
                };

                this.init();
            };
            FileControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            FileControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {

                        if (self.scope.ngRequired) {
                            if (!self.scope.ngModel)
                                valid = false;
                            else if (!_.isString(self.scope.ngModel))
                                valid = false;
                            else if (self.scope.ngModel === '')
                                valid = false;
                            else if (!_.str.startsWith(self.scope.ngModel, 'files/'))
                                valid = false;
                        }

                        if (self.scope.ngModel) {
                            if (!_.isString(self.scope.ngModel))
                                valid = false;
                            else if (self.scope.ngModel === '')
                                valid = false;
                            else if (!_.str.startsWith(self.scope.ngModel, 'files/'))
                                valid = false;
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
                    ngFileGroup: '@',
                    ngExtensions: '='
                }),
                link: function (scope, element, attrs) {
                    var control = new FileControl(scope, element, attrs);
                    scope.$emit(CONTROL_EVENTS.register, control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlFile.html'
            };

        }]);

})();