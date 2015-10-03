/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlFileList', ['$timeout', 'ModalService', 'CONTROL_EVENTS', function ($timeout, ModalService, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngFileGroup: '=',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngExtensions: '=',
                    ngValidating: '=',
                    ngChangeFn: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-file-list');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.value = [];
                    scope.valid = true;
                    scope.empty = false;
                    
                    scope.invalid = {};
                    scope.wrong = {};

                    var initiated = false;

                    scope.$watch('ngDisabled', function (newValue) {
                        if (initiated)
                            scope.valid = isValid();
                    });

                    scope.$watch('ngValidating', function (newValue) {
                        if (initiated)
                            if (newValue === false)
                                scope.valid = true;
                            else
                                scope.valid = isValid();
                    });

                    scope.changed = function () {
                        if (scope.ngChangeFn) {
                            if (typeof (scope.ngChangeFn) === 'function') {
                                scope.ngChangeFn(scope.ngModel);
                            }
                        }
                        else {
                            $timeout(function () {
                                scope.$emit(CONTROL_EVENTS.valueChanged, scope.ngModel);
                            }, 50);
                        }
                    };

                    var fileGroup = scope.ngFileGroup ? scope.ngFileGroup : 'public';

                    var isValid = function () {
                        var valid = true;
                        scope.empty = false;

                        var validating = scope.ngValidating !== false;
                        if (validating && !scope.ngDisabled && element.is(':visible')) {

                            if (scope.ngRequired) {
                                if (!scope.ngModel) {
                                    valid = false;
                                    scope.empty = true;
                                }
                                else if (!_.isArray(scope.ngModel)) {
                                    valid = false;
                                }
                                else if (scope.ngModel.length === 0) {
                                    valid = false;
                                    scope.empty = true;
                                }
                            }

                            if (scope.ngModel) {
                                if (!_.isArray(scope.ngModel))
                                    valid = false;
                                else {

                                    $(scope.ngModel).each(function (i, item) {
                                        scope.invalid[i] = false;
                                        if (!item) {
                                            valid = false;
                                            scope.invalid[i] = true;
                                        }
                                        else if (!_.isString(item)) {
                                            valid = false;
                                            scope.invalid[i] = true;
                                        }
                                        else if (!_.str.startsWith(item, 'files/')) {
                                            valid = false;
                                            scope.invalid[i] = true;
                                        }
                                    });

                                }
                            }
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

                        if (initiated)
                            scope.valid = isValid();
                    });

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });
                    
                    scope.$on(CONTROL_EVENTS.validate, function (sender) {
                        if (initiated) {
                            scope.valid = isValid();
                        }
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });

                    scope.$on(CONTROL_EVENTS.clearValidation, function (sender) {
                        initiated = false;
                        scope.valid = true;
                    });

                    scope.edit = function (index) {
                        var item = scope.ngModel[index];

                        ModalService.open({
                            title: 'select the file you want',
                            controller: 'FileSelectorController',
                            selected: item,
                            group: fileGroup,
                            template: 'tmpl/core/modals/FileSelector.html',
                            mode: 'single',
                            extensions: scope.ngExtensions || []
                        }).then(function (result) {
                            scope.ngModel[index] = result;
                            scope.ngModel = scope.ngModel.slice(0);

                            if (initiated)
                                scope.valid = isValid();

                            scope.changed();
                        });
                    };

                    scope.add = function () {
                        ModalService.open({
                            title: 'select the files you want',
                            controller: 'FileSelectorController',
                            template: 'tmpl/core/modals/FileSelector.html',
                            group: fileGroup,
                            mode: 'multiple',
                            extensions: scope.ngExtensions || []
                        }).then(function (results) {
                            if (!scope.ngModel)
                                scope.ngModel = [];

                            $(results).each(function (i, item) {
                                scope.ngModel.push(item);
                            });
                            scope.ngModel = scope.ngModel.slice(0);

                            if (initiated)
                                scope.valid = isValid();

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

                },
                templateUrl: 'tmpl/core/controls/ctrlFileList.html'
            };

        }]);

})();