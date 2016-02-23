/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlFileList', ['$rootScope', '$timeout', '$q', 'ModalService', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, ModalService, CONTROL_EVENTS) {

            var FileListControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-file-list');

                scope.value = [];

                scope.faulty = false;

                scope.faults.empty = false;
                scope.faults.exceeded = false;

                scope.invalid = {};
                scope.wrong = {};

                var fileGroup = scope.ngFileGroup ? scope.ngFileGroup : 'public';

                scope.$watch('ngModel', function (newValue, prevValue) {
                    if (newValue) {
                        if (_.isArray(newValue)) {
                            scope.wrong = {};
                            scope.value = newValue;
                            $(newValue).each(function (i, item) {
                                scope.wrong[i] = false;

                                if (!item) {
                                    scope.wrong[i] = true;
                                }
                                else if (typeof (item) !== 'string') {
                                    scope.wrong[i] = true;
                                }
                                else if (!_.str.startsWith(item, 'files/')) {
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

                    ModalService.open(function (x) {
                        x.title('select the file you want');
                        x.path('/content/files');
                        x.maximized();
                        x.scope({
                            selected: item,
                            group: fileGroup,
                            mode: 'single',
                            extensions: scope.ngExtensions || []
                        });
                    }).then(function (result) {
                        scope.ngModel[index] = result;
                        scope.ngModel = scope.ngModel.slice(0);

                        self.validate();

                        scope.changed();
                    });
                };

                scope.add = function () {
                    ModalService.open(function (x) {
                        x.title('select the files you want');
                        x.path('/content/files');
                        x.maximized();
                        x.scope({
                            group: fileGroup,
                            mode: 'multiple',
                            extensions: scope.ngExtensions || []
                        });
                    }).then(function (results) {

                        if (!scope.ngModel)
                            scope.ngModel = [];

                        $(results).each(function (i, item) {
                            scope.ngModel.push(item);
                        });
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

                        if (!_.isEqual(files, scope.ngModel)) {
                            scope.ngModel = files;
                            scope.changed();
                        }
                    }
                };

                this.init().then(function () {

                });
            };
            FileListControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            FileListControl.prototype.isValid = function () {
                var deferred = $q.defer();
                
                var self = this;

                this.scope.faulty = false;
                this.scope.faults.empty = false;
                this.scope.faults.exceeded = false;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {

                        if (self.scope.ngRequired) {
                            if (!self.scope.ngModel) {
                                self.scope.valid = false;
                                self.scope.faults.empty = true;
                            }
                            else if (!_.isArray(self.scope.ngModel)) {
                                self.scope.valid = false;
                            }
                            else if (self.scope.ngModel.length === 0) {
                                self.scope.valid = false;
                                self.scope.faults.empty = true;
                            }
                        }

                        if (self.scope.ngModel) {
                            if (!_.isArray(self.scope.ngModel))
                                self.scope.valid = false;
                            else {

                                $(self.scope.ngModel).each(function (i, item) {
                                    self.scope.invalid[i] = false;
                                    if (!item) {
                                        self.scope.valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                    else if (!_.isString(item)) {
                                        self.scope.valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                    else if (!_.str.startsWith(item, 'files/')) {
                                        self.scope.valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                });

                                if (self.scope.ngMaxLength !== undefined) {
                                    var maxLength = parseInt(self.scope.ngMaxLength);
                                    if (!isNaN(maxLength) && self.scope.ngModel.length > maxLength) {
                                        self.scope.valid = false;
                                        self.scope.faults.exceeded = true;
                                    }
                                }
                            }
                        }

                    }

                    if (self.scope.faults.empty || self.scope.faults.exceeded)
                        self.scope.faulty = true;

                    deferred.resolve(self.scope.valid);
                });

                return deferred.promise;
            };

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngFileGroup: '@',
                    ngExtensions: '=',
                    ngMaxLength: '='
                }),
                link: function (scope, element, attrs) {
                    var control = new FileListControl(scope, element, attrs);
                    scope.$emit(CONTROL_EVENTS.register, control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlFileList.html'
            };

        }]);

})();