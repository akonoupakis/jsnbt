/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlImageList', ['$rootScope', '$timeout', '$q', 'ModalService', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, ModalService, CONTROL_EVENTS) {

            var ImageListControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-image-list');

                scope.value = [];
                scope.empty = false;
                scope.extensions = scope.ngExtensions ? scope.ngExtensions : ['.png', '.jpg', '.jpeg', '.gif', '.tiff'];

                scope.invalid = {};
                scope.wrong = {};

                var fileGroup = scope.ngFileGroup ? scope.ngFileGroup : 'public';

                var isValid = function () {
                    var valid = true;
                    scope.empty = false;

                    var validating = scope.ngValidating !== false;
                    if (validating && !scope.ngDisabled && element.is(':visible')) {

                        
                    }

                    return valid;
                };

                scope.$watch('ngModel', function (newValue, prevValue) {
                    if (newValue) {
                        if (_.isArray(newValue)) {
                            scope.wrong = {};
                            scope.value = newValue;
                            $(newValue).each(function (i, item) {
                                scope.wrong[i] = false;

                                if (!item.src) {
                                    scope.wrong[i] = true;
                                }
                                else if (!_.isArray(item.gen)) {
                                    scope.wrong[i] = true;
                                }
                                else if (item.gen.length !== 2) {
                                    scope.wrong[i] = true;
                                }
                            });
                        }
                        else {
                            scope.wrong = {};
                            scope.value = [];
                        }
                    }
                    else {
                        scope.wrong = {};
                        scope.value = [];
                    }

                    self.validate();
                });

                scope.edit = function (index) {
                    var item = scope.ngModel[index];

                    ModalService.select(function (x) {
                        x.title('select and crop the image you want');
                        x.controller('ImageSelectorController');
                        x.template('tmpl/core/modals/imageSelector.html');
                        x.scope({
                            selected: item,
                            group: fileGroup,
                            mode: 'single',
                            extensions: scope.extensions,
                            step: 1,
                            height: scope.ngHeight,
                            width: scope.ngWidth
                        });
                    }).then(function (result) {
                        scope.ngModel[index] = result;
                        scope.ngModel = scope.ngModel.slice(0);

                        self.validate();

                        scope.changed();
                    });
                };

                scope.crop = function (index) {
                    var item = scope.ngModel[index];

                    ModalService.select(function (x) {
                        x.title('crop ' + item.src);
                        x.controller('ImageSelectorController');
                        x.template('tmpl/core/modals/imageSelector.html');
                        x.scope({
                            selected: item,
                            group: fileGroup,
                            mode: 'single',
                            extensions: scope.extensions,
                            step: 2,
                            height: scope.ngHeight,
                            width: scope.ngWidth
                        });
                    }).then(function (result) {
                        scope.ngModel[index] = result;
                        scope.ngModel = scope.ngModel.slice(0);

                        self.validate();

                        scope.changed();
                    });
                };

                scope.add = function () {

                    ModalService.select(function (x) {
                        x.title('select and crop the image you want');
                        x.controller('ImageSelectorController');
                        x.template('tmpl/core/modals/imageSelector.html');
                        x.scope({                  
                            group: fileGroup,
                            mode: 'single',
                            extensions: scope.extensions,
                            step: 1,
                            height: scope.ngHeight,
                            width: scope.ngWidth
                        });
                    }).then(function (result) {
                        if (!scope.ngModel)
                            scope.ngModel = [];

                        scope.ngModel.push(result);
                        scope.ngModel = scope.ngModel.slice(0);

                        self.validate();

                        scope.changed();
                    });
                };

                scope.clear = function (index) {
                    var newValue = [];

                    $(scope.ngModel).each(function (i, item) {
                        if (i !== index) {
                            newValue.push(item);
                        }
                    });

                    scope.ngModel = newValue;
                    scope.changed();
                };

                scope.sortableOptions = {
                    axis: 'v',

                    handle: '.glyphicon-move',
                    cancel: '',
                    containment: "parent",

                    stop: function (e, ui) {
                        var files = scope.value.map(function (x) {
                            return x;
                        });

                        scope.ngModel = files;
                        scope.changed();
                    }
                };

                this.init();
            };
            ImageListControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            ImageListControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                self.scope.empty = false;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {

                        if (self.scope.ngRequired) {
                            if (!self.scope.ngModel) {
                                valid = false;
                                scope.empty = true;
                            }
                            else if (!_.isArray(self.scope.ngModel)) {
                                valid = false;
                            }
                            else if (self.scope.ngModel.length === 0) {
                                valid = false;
                                self.scope.empty = true;
                            }
                        }

                        if (self.scope.ngModel) {
                            if (!_.isArray(self.scope.ngModel))
                                valid = false;
                            else {

                                $(self.scope.ngModel).each(function (i, item) {
                                    self.scope.invalid[i] = false;
                                    if (!item.src) {
                                        valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                    else if (!_.isArray(item.gen)) {
                                        valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                    else if (item.gen.length !== 2) {
                                        valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                    else {
                                        if (self.scope.ngHeight) {
                                            if (item.gen[1].options.height !== self.scope.ngHeight) {
                                                valid = false;
                                                self.scope.invalid[i] = true;
                                            }
                                        }
                                        if (self.scope.ngWidth) {
                                            if (item.gen[1].options.width !== self.scope.ngWidth) {
                                                valid = false;
                                                self.scope.invalid[i] = true;
                                            }
                                        }
                                    }

                                });

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
                    return new ImageListControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlImageList.html'
            };

        }]);

})();