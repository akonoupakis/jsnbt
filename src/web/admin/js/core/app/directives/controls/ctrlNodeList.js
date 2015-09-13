/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlNodeList', ['$timeout', '$data', '$fn', 'CONTROL_EVENTS', function ($timeout, $data, $fn, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDomain: '=',
                    ngOptions: '=',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngValidating: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-node-list');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.value = [];
                    scope.valid = true;
                    scope.empty = false;

                    scope.invalid = {};
                    scope.wrong = {};
                    scope.missing = {};

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
                        $timeout(function () {
                            scope.$emit(CONTROL_EVENTS.valueChanged, scope.ngModel);
                        }, 50);
                    };

                    var isValid = function () {
                        var valid = true;
                        scope.empty = false;

                        var validating = scope.ngValidating !== false;
                        if (validating && !scope.ngDisabled) {

                            if (valid) {

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
                                            else if (scope.wrong[i] && scope.missing[i]) {
                                                valid = false;
                                                scope.invalid[i] = true;
                                            }
                                        });

                                    }

                                }

                            }

                        }

                        return valid;
                    };

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

                                $data.nodes.get({
                                    domain: scope.ngDomain,
                                    id: { $in: newValueKeys }
                                }).then(function (results) {
                                    var scopeValues = [];

                                    $(newValue).each(function (nv, nValue) {
                                        var result = _.first(_.filter(results, function (x) { return x.id === nValue; }));
                                        if (result) {
                                            scopeValues.push({
                                                id: result.id,
                                                name: result.name
                                            });

                                            scope.wrong[nv] = false;
                                            scope.missing[nv] = false;
                                        }
                                        else {
                                            scopeValues.push({
                                                id: nValue,
                                                name: nValue
                                            });

                                            scope.wrong[nv] = true;

                                            if (!invalids[nv])
                                                scope.missing[nv] = true;
                                        }
                                    });

                                    scope.value = scopeValues;

                                    if (initiated)
                                        scope.valid = isValid();

                                }, function (error) {
                                    throw error;
                                });
                            }
                            else {
                                scope.wrong = {};
                                scope.missing = {};
                                scope.value = [];
                            }
                        }
                        else {
                            scope.wrong = {};
                            scope.missing = {};
                            scope.value = [];

                            if (initiated)
                                scope.valid = isValid();
                        }
                    });

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });

                    scope.edit = function (index) {
                        var item = scope.ngModel[index];

                        var invoked = $fn.invoke(scope.ngDomain, 'selectNode', [scope.ngDomain, item, scope.ngOptions], true);

                        if (invoked) {
                            invoked.then(function (selectedNodeId) {
                                scope.ngModel[index] = selectedNodeId;
                                scope.ngModel = scope.ngModel.slice(0);

                                if (initiated)
                                    scope.valid = isValid();

                                scope.changed();
                            }, function (error) {
                                throw error;
                            });
                        }
                        else {
                            throw new Error('unable to select node for domain: ' + scope.ngDomain);
                        }
                    };

                    scope.add = function () {
                        var invoked = $fn.invoke(scope.ngDomain, 'selectNodes', [scope.ngDomain, [], scope.ngOptions], true);
                        
                        if (invoked) {
                            invoked.then(function (selectedNodeIds) {
                                if (!scope.ngModel)
                                    scope.ngModel = [];

                                $(selectedNodeIds).each(function (i, item) {
                                    scope.ngModel.push(item);
                                });

                                scope.ngModel = scope.ngModel.slice(0);

                                if (initiated)
                                    scope.valid = isValid();

                                scope.changed();
                            }, function (error) {
                                throw error;
                            });
                        }
                        else {
                            throw new Error('unable to select node for domain: ' + scope.ngDomain);
                        }
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
                        
                            scope.ngModel = nodeIds;
                            scope.changed();
                        }
                    };

                },
                templateUrl: 'tmpl/core/controls/ctrlNodeList.html'
            };

        }]);

})();