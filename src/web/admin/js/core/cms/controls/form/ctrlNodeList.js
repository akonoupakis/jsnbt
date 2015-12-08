/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlNodeList', ['$rootScope', '$timeout', '$data', '$jsnbt', '$q', 'ModalService', 'CONTROL_EVENTS', function ($rootScope, $timeout, $data, $jsnbt, $q, ModalService, CONTROL_EVENTS) {

            var NodeListControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-node-list');

                scope.value = [];
                
                scope.faulty = false;

                scope.faults.empty = false;
                scope.faults.exceeded = false;

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
                        }
                    }
                    else {
                        scope.wrong = {};
                        scope.missing = {};
                        scope.value = [];

                        self.validate();
                    }
                });
                
                var moduleLookup = function (entities) {
                    var deferred = $q.defer();

                    var opts = {};
                    $.extend(true, opts, {
                        entities: entities
                    }, scope.ngOptions);
                                        
                    ModalService.select(function (x) {
                        x.title('select a content node');
                        x.controller('NodeSelectorController');
                        x.template('tmpl/core/modals/nodeSelector.html');
                        x.scope({
                            domain: scope.ngDomain
                        });
                        $jsnbt.modules[scope.ngDomain].lookupNode(x, 'single', scope.ngModel, opts);
                    }).then(function (selectedNodeId) {
                        deferred.resolve(selectedNodeId);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };

                var moduleLookupMany = function (entities, selected) {
                    var deferred = $q.defer();

                    var opts = {};
                    $.extend(true, opts, {
                        entities: entities
                    }, scope.ngOptions);

                    ModalService.select(function (x) {
                        x.title('select the content nodes you want');
                        x.controller('NodeSelectorController');
                        x.template('tmpl/core/modals/nodeSelector.html');
                        x.scope({
                            domain: scope.ngDomain
                        });
                        $jsnbt.modules[scope.ngDomain].lookupNode(x, 'multiple', selected || scope.ngModel, opts);
                    }).then(function (selectedNodeId) {
                        deferred.resolve(selectedNodeId);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };

                var entityLookup = function (entity) {
                    var deferred = $q.defer();

                    if (typeof ($jsnbt.entities[entity].lookupNode) === 'function') {
                        var opts = $.extend({
                            entities: [entity]
                        }, scope.ngOptions);

                        var modalOpts = 

                        ModalService.select(function (x) {
                            x.title('select a content node');
                            x.controller('NodeSelectorController');
                            x.template('tmpl/core/modals/nodeSelector.html');
                            x.scope({
                                domain: scope.ngDomain
                            });
                            $jsnbt.entities[entity].lookupNode(x, 'single', scope.ngModel, opts);
                        }).then(function (selectedNodeId) {
                            deferred.resolve(selectedNodeId);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }
                    else {
                        moduleLookup([entity]).then(function (selectedNodeId) {
                            deferred.resolve(selectedNodeId);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }

                    return deferred.promise;
                };

                var entityLookupMany = function (entity, selected) {
                    var deferred = $q.defer();

                    if (typeof ($jsnbt.entities[entity].lookupNode) === 'function') {
                        var opts = $.extend({
                            entities: [entity]
                        }, scope.ngOptions);

                        ModalService.select(function (x) {
                            x.title('select the content nodes you want');
                            x.controller('NodeSelectorController');
                            x.template('tmpl/core/modals/nodeSelector.html');
                            x.scope({
                                domain: scope.ngDomain
                            });
                            $jsnbt.entities[entity].lookupNode(x, 'multiple', selected || scope.ngModel, opts);
                        }).then(function (selectedNodeId) {
                            deferred.resolve(selectedNodeId);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }
                    else {
                        moduleLookupMany([entity]).then(function (selectedNodeId) {
                            deferred.resolve(selectedNodeId);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }

                    return deferred.promise;
                };

                scope.edit = function (index) {
                    var item = scope.ngModel[index];

                    if (_.isArray(scope.ngEntities) && scope.ngEntities.length > 0) {
                        if (scope.ngEntities.length === 1) {

                            var entity = _.first(scope.ngEntities);
                            entityLookup(entity).then(function (selectedNodeId) {
                                scope.ngModel[index] = selectedNodeId;
                                scope.ngModel = scope.ngModel.slice(0);

                                self.validate();

                                scope.changed();
                            });
                        }
                        else {
                            moduleLookup(scope.ngEntities).then(function (selectedNodeId) {
                                scope.ngModel[index] = selectedNodeId;
                                scope.ngModel = scope.ngModel.slice(0);

                                self.validate();

                                scope.changed();
                            });
                        }
                    }
                    else {
                        moduleLookup().then(function (selectedNodeId) {
                            scope.ngModel[index] = selectedNodeId;
                            scope.ngModel = scope.ngModel.slice(0);

                            self.validate();

                            scope.changed();
                        });
                    }

                };

                scope.add = function () {

                    if (_.isArray(scope.ngEntities) && scope.ngEntities.length > 0) {
                        if (scope.ngEntities.length === 1) {

                            var entity = _.first(scope.ngEntities);
                            entityLookupMany(entity, []).then(function (selectedNodeIds) {
                                if (!scope.ngModel)
                                    scope.ngModel = [];

                                $(selectedNodeIds).each(function (i, item) {
                                    scope.ngModel.push(item);
                                });

                                scope.ngModel = scope.ngModel.slice(0);

                                self.validate();

                                scope.changed();
                            });
                        }
                        else {

                            moduleLookupMany(scope.ngEntities, []).then(function (selectedNodeIds) {
                                if (!scope.ngModel)
                                    scope.ngModel = [];

                                $(selectedNodeIds).each(function (i, item) {
                                    scope.ngModel.push(item);
                                });

                                scope.ngModel = scope.ngModel.slice(0);

                                self.validate();

                                scope.changed();
                            });
                        }
                    }
                    else {
                        moduleLookupMany(undefined, []).then(function (selectedNodeIds) {
                            if (!scope.ngModel)
                                scope.ngModel = [];

                            $(selectedNodeIds).each(function (i, item) {
                                scope.ngModel.push(item);
                            });

                            scope.ngModel = scope.ngModel.slice(0);

                            self.validate();

                            scope.changed();
                        });
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

                        if (!_.isEqual(nodeIds, scope.ngModel)) {
                            scope.ngModel = nodeIds;
                            scope.changed();
                        }
                    }
                };

                this.copy(scope, 'ngLanguage', scope, 'language');

                this.init();
            };
            NodeListControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            NodeListControl.prototype.isValid = function () {
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
                                    else if (self.scope.wrong[i] && self.scope.missing[i]) {
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
                transclude: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngLanguage: '=',
                    ngDomain: '=',
                    ngOptions: '=',
                    ngMaxLength: '='
                }),
                link: function (scope, element, attrs) {
                    var control = new NodeListControl(scope, element, attrs);
                    scope.$emit(CONTROL_EVENTS.register, control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlNodeList.html'
            };

        }]);

})();