﻿/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlDataList', ['$rootScope', '$timeout', '$data', '$jsnbt', '$q', 'ModalService', 'CONTROL_EVENTS', function ($rootScope, $timeout, $data, $jsnbt, $q, ModalService, CONTROL_EVENTS) {

            var DataListControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-data-list');

                scope.value = [];
                scope.empty = false;

                scope.invalid = {};
                scope.wrong = {};
                scope.missing = {};
                
                scope.$watch('ngModel', function (newValue, prevValue) {
                    if (newValue) {
                        if (_.isArray(newValue)) {
                            var invalids = {};

                            var newValueKeys = [];

                            $(newValue).each(function (i, item) {
                                if (!_.isString(item)) {
                                    invalids[i] = true;
                                }
                                else {
                                    newValueKeys.push(item);
                                }
                            });

                            scope.wrong = {};
                            scope.missing = {};

                            $data.data.get({
                                domain: scope.ngDomain,
                                list: scope.ngListId,
                                id: { $in: newValueKeys }
                            }).then(function (results) {
                                var scopeValues = [];

                                $(newValue).each(function (nv, nValue) {
                                    var result = _.first(_.filter(results, function (x) { return x.id === nValue; }));
                                    if (result) {
                                        scopeValues.push(result);
                                        scope.wrong[nv] = false;
                                        scope.missing[nv] = false;
                                    }
                                    else {
                                        scopeValues.push({
                                            id: nValue
                                        });

                                        scope.wrong[nv] = true;

                                        if (!invalids[nv])
                                            scope.missing[nv] = true;
                                    }
                                });

                                scope.value = scopeValues;

                                self.validate();

                            }).catch(function (error) {
                                throw error;
                            });
                        }
                        else {
                            scope.wrong = {};
                            scope.missing = {};
                            scope.value = [];

                            self.validate();
                        }
                    }
                    else {
                        scope.wrong = {};
                        scope.missing = {};
                        scope.value = [];

                        self.validate();
                    }
                });
                
                scope.edit = function (index) {
                    var item = scope.ngModel[index];

                    var list = _.find($jsnbt.lists, function (x) {
                        return x.id === scope.ngListId;
                    });

                    ModalService.select(function (x) {
                        x.title('select the data item you want');
                        x.controller('DataSelectorController');
                        x.template('tmpl/core/modals/dataSelector.html');
                        list.lookupData(x, 'single', item);
                    }).then(function (result) {
                        scope.ngModel[index] = result;
                        scope.ngModel = scope.ngModel.slice(0);

                        self.validate();

                        scope.changed();
                    });
                };

                scope.add = function () {

                    var list = _.find($jsnbt.lists, function (x) {
                        return x.id === scope.ngListId;
                    });

                    ModalService.select(function (x) {
                        x.title('select the data items you want');
                        x.controller('DataSelectorController');
                        x.template('tmpl/core/modals/dataSelector.html');
                        list.lookupData(x, 'multiple');
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
                        var nodeIds = scope.value.map(function (x) {
                            return x.id;
                        });

                        if (!_.isEqual(nodeIds, scope.ngModel)) {
                            scope.ngModel = nodeIds;
                            scope.changed();
                        }
                    }
                };

                this.copy(scope, 'ngLanguage', scope, 'language');

                self.init();
            };
            DataListControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            DataListControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                self.scope.empty = false;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {
                        if (self.scope.ngRequired) {
                            if (!self.scope.ngModel) {
                                valid = false;
                                self.scope.empty = true;
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
                                    if (!item) {
                                        valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                    else if (!_.isString(item)) {
                                        valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                    else if (self.scope.wrong[i] && self.scope.missing[i]) {
                                        valid = false;
                                        self.scope.invalid[i] = true;
                                    }
                                });

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
                transclude: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngLanguage: '=',
                    ngDomain: '=',
                    ngListId: '='                    
                }),
                link: function (scope, element, attrs) {
                    var control = new DataListControl(scope, element, attrs);
                    $rootScope.controller.register(control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlDataList.html'
            };

        }]);

})();