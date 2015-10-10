/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlNodeList', ['$rootScope', '$timeout', '$data', '$fn', '$q', 'CONTROL_EVENTS', function ($rootScope, $timeout, $data, $fn, $q, CONTROL_EVENTS) {

            var NodeListControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-node-list');

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
                                            name: result.title[scope.ngLanguage]
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

                                self.validate();

                            }).catch(function (error) {
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

                        self.validate();
                    }
                });
                
                scope.edit = function (index) {
                    var item = scope.ngModel[index];

                    var invoked = $fn.invoke(scope.ngDomain, 'selectNode', [scope.ngDomain, item, scope.ngOptions], true);

                    if (invoked) {
                        invoked.then(function (selectedNodeId) {
                            scope.ngModel[index] = selectedNodeId;
                            scope.ngModel = scope.ngModel.slice(0);

                            self.validate();

                            scope.changed();
                        }).catch(function (error) {
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

                            self.validate();

                            scope.changed();
                        }).catch(function (error) {
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

                this.init();
            };
            NodeListControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            NodeListControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                this.scope.empty = false;

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

                    deferred.resolve(valid);
                });

                return deferred.promise;
            };

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngLanguage: '=',
                    ngDomain: '=',
                    ngOptions: '='
                }),
                link: function (scope, element, attrs) {
                    return new NodeListControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlNodeList.html'
            };

        }]);

})();