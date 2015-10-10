/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlNode', ['$rootScope', '$timeout', '$data', '$fn', '$q', 'CONTROL_EVENTS', function ($rootScope, $timeout, $data, $fn, $q, CONTROL_EVENTS) {

            var NodeControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));
                
                var self = this;
                
                element.addClass('ctrl');
                element.addClass('ctrl-node');
                
                scope.value = '';

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
                                    scope.value = response.title[scope.ngLanguage];
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
                                scope.value = '';
                                scope.wrong = false;
                                scope.missing = false;

                                self.validate();
                            }
                        }
                        else {
                            scope.value = '';
                            scope.wrong = true;
                            scope.missing = false;

                            self.validate();
                        }
                    }
                    else {
                        scope.value = '';
                        scope.wrong = false;
                        scope.missing = false;

                        self.validate();
                    }
                });

                scope.select = function () {
                    if (!scope.ngDomain || scope.ngDomain === '')
                        return;

                    var invoked = $fn.invoke(scope.ngDomain, 'selectNode', [scope.ngDomain, scope.ngModel, scope.ngOptions], true);
                    if (invoked) {
                        invoked.then(function (selectedNodeId) {
                            scope.ngModel = selectedNodeId || '';
                            scope.changed();
                        }).catch(function (error) {
                            throw error;
                        });
                    }
                    else {
                        throw new Error('unable to select node for domain: ' + scope.ngDomain);
                    }
                };

                scope.clear = function () {
                    scope.ngModel = '';
                    scope.changed();
                };

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
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngLanguage: '=',
                    ngDomain: '=',
                    ngOptions: '='
                }),
                link: function (scope, element, attrs) {
                    return new NodeControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlNode.html'
            };

        }]);

})();