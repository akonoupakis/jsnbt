/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlNode', ['$rootScope', '$timeout', '$data', '$jsnbt', '$q', 'ModalService', 'CONTROL_EVENTS', function ($rootScope, $timeout, $data, $jsnbt, $q, ModalService, CONTROL_EVENTS) {

            var NodeControl = function (scope, element, attrs, ctrl, transclude) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-node');

                scope.value = {};

                scope.wrong = false;
                scope.missing = false;

                scope.$watch('ngModel', function (newValue, prevValue) {
                    if (newValue) {
                        if (_.isString(newValue)) {
                            if (newValue !== '') {
                                $data.nodes.get({
                                    id: newValue,
                                    domain: scope.ngDomain
                                }).then(function (response) {
                                    scope.value = response;
                                    scope.wrong = false;
                                    scope.missing = false;

                                    self.validate();
                                }).catch(function (error) {
                                    scope.value = newValue;
                                    scope.wrong = true;
                                    scope.missing = true;

                                    self.validate();
                                });
                            }
                            else {
                                scope.value = {};
                                scope.wrong = false;
                                scope.missing = false;

                                self.validate();
                            }
                        }
                        else {
                            scope.value = {};
                            scope.wrong = true;
                            scope.missing = false;

                            self.validate();
                        }
                    }
                    else {
                        scope.value = {};
                        scope.wrong = false;
                        scope.missing = false;

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

                var entityLookup = function (entity) {
                    var deferred = $q.defer();

                    if (typeof ($jsnbt.entities[entity].lookupNode) === 'function') {
                        var opts = $.extend({
                            entities: [entity]
                        }, scope.ngOptions);

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

                scope.select = function () {
                    if (!scope.ngDomain || scope.ngDomain === '')
                        return;

                    if (_.isArray(scope.ngEntities) && scope.ngEntities.length > 0) {
                        if (scope.ngEntities.length === 1) {

                            var entity = _.first(scope.ngEntities);
                            entityLookup(entity).then(function (selectedNodeId) {
                                scope.ngModel = selectedNodeId || '';
                                scope.changed();
                            });
                        }
                        else {
                            moduleLookup(scope.ngEntities).then(function (selectedNodeId) {
                                scope.ngModel = selectedNodeId || '';
                                scope.changed();
                            });
                        }
                    }
                    else {
                        moduleLookup().then(function (selectedNodeId) {
                            scope.ngModel = selectedNodeId || '';
                            scope.changed();
                        });
                    }
                };

                scope.clear = function () {
                    scope.ngModel = '';
                    scope.changed();
                };

                var childScope = $rootScope.$new();
                this.copy(scope, 'value', childScope, 'model');
                this.copy(scope, 'ngLanguage', childScope, 'language');

                transclude(childScope, function (clone, innerScope) {
                    element.find('.transcluded').empty();
                    element.find('.transcluded').append(clone);
                });

                this.init();

            };
            NodeControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            NodeControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {
                        if (self.scope.ngRequired) {
                            if (!self.scope.ngModel) {
                                valid = false;
                            }
                            else if (!_.isString(self.scope.ngModel)) {
                                valid = false;
                            }
                            else if (self.scope.ngModel === '') {
                                valid = false;
                            }
                        }

                        if (self.scope.ngModel) {
                            if (!_.isString(self.scope.ngModel))
                                valid = false;
                            else if (self.scope.wrong && self.scope.missing)
                                valid = false;
                        }
                    }

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
                    ngEntities: '=',
                    ngOptions: '='
                }),
                link: function (scope, element, attrs, ctrl, transclude) {
                    return new NodeControl(scope, element, attrs, ctrl, transclude);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlNode.html'
            };

        }]);

})();