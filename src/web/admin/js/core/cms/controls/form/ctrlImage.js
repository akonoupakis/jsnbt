/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlImage', ['$rootScope', '$timeout', '$q', 'ModalService', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, ModalService, CONTROL_EVENTS) {

            var ImageControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-image');

                scope.value = '';
                scope.wrong = false;
                scope.extensions = scope.ngExtensions ? scope.ngExtensions : ['.png', '.jpg', '.jpeg', '.gif', '.tiff'];

                var fileGroup = scope.ngFileGroup ? scope.ngFileGroup : 'public';

                scope.$watch('ngModel', function (newValue, prevValue) {
                    if (newValue) {
                        if (_.isObject(newValue)) {
                            scope.value = newValue.src || '';
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

                scope.edit = function () {
                    ModalService.select(function (x) {
                        x.title('select and crop the image you want');
                        x.controller('ImageSelectorController');
                        x.template('tmpl/core/modals/imageSelector.html');
                        x.scope({
                            selected: scope.ngModel,
                            group: fileGroup,
                            mode: 'single',
                            extensions: scope.extensions,
                            step: 1,
                            height: scope.ngHeight,
                            width: scope.ngWidth
                        });
                    }).then(function (result) {
                        scope.ngModel = result;
                        scope.changed();
                    });
                };

                scope.crop = function () {
                    ModalService.select(function (x) {
                        x.title('crop ' + scope.ngModel.src);
                        x.controller('ImageSelectorController');
                        x.template('tmpl/core/modals/imageSelector.html');
                        x.scope({
                            selected: scope.ngModel,
                            group: fileGroup,
                            mode: 'single',
                            extensions: scope.extensions,
                            step: 2,
                            height: scope.ngHeight,
                            width: scope.ngWidth
                        });
                    }).then(function (result) {
                        scope.ngModel = result;
                        scope.changed();
                    });
                };

                scope.clear = function () {
                    scope.ngModel = undefined;
                    scope.changed();
                };

                this.init();
            };
            ImageControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            ImageControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {

                        if (self.scope.ngRequired) {
                            if (!self.scope.ngModel)
                                valid = false;
                            else if (!_.isObject(self.scope.ngModel))
                                valid = false;
                            else {
                                if (!self.scope.ngModel.src)
                                    valid = false;
                                else if (self.scope.ngModel.src === '')
                                    valid = false;
                            }
                        }

                        if (self.scope.ngModel) {
                            if (!_.isObject(self.scope.ngModel))
                                valid = false;
                            else {
                                if (!self.scope.ngModel.src)
                                    valid = false;
                                else if (!_.isArray(self.scope.ngModel.gen))
                                    valid = false;
                                else if (self.scope.ngModel.gen.length !== 2)
                                    valid = false;
                                else {
                                    if (self.scope.ngHeight) {
                                        if (self.scope.ngModel.gen[1].options.height !== self.scope.ngHeight)
                                            valid = false;
                                    }
                                    if (self.scope.ngWidth) {
                                        if (self.scope.ngModel.gen[1].options.width !== self.scope.ngWidth)
                                            valid = false;
                                    }
                                }
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
                    ngFileGroup: '@',
                    ngExtensions: '=',
                    ngHeight: '=',
                    ngWidth: '='
                }),
                link: function (scope, element, attrs) {
                    return new ImageControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlImage.html'
            };

        }]);

})();