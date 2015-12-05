/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlData', ['$rootScope', '$timeout', '$data', '$jsnbt', '$q', 'ModalService', 'CONTROL_EVENTS', function ($rootScope, $timeout, $data, $jsnbt, $q, ModalService, CONTROL_EVENTS) {

            var DataControl = function (scope, element, attrs, ctrl, transclude) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-data');

                scope.value = {};
                scope.wrong = false;
                scope.missing = false;
                
                scope.$watch('ngModel', function (newValue, prevValue) {
                    if (newValue) {
                        if (_.isString(newValue)) {
                            if (newValue !== '') {
                                $data.data.get({
                                    domain: scope.ngDomain,
                                    list: scope.ngListId,
                                    id: newValue
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

                scope.select = function () {
                    if (!scope.ngDomain || scope.ngDomain === '')
                        return;

                    var list = _.find($jsnbt.lists, function (x) {
                        return x.id === scope.ngListId;
                    });

                    ModalService.select(function (x) {
                        x.title('select a data item');
                        x.controller('DataSelectorController');
                        x.template('tmpl/core/modals/dataSelector.html');
                        list.lookupData(x, 'single', scope.ngModel);
                    }).then(function (result) {
                        scope.ngModel = result || '';
                        scope.changed();
                    });
                };

                scope.clear = function () {
                    scope.ngModel = '';
                    scope.changed();
                };

                var childScope = $rootScope.$new();
                this.copy(scope, 'value', childScope, 'row');
                this.copy(scope, 'ngLanguage', childScope, 'language');

                transclude(childScope, function (clone, innerScope) {
                    element.find('.transcluded').empty();
                    element.find('.transcluded').append(clone);
                });

                this.init();
            };
            DataControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            DataControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {
                        if (self.scope.ngRequired) {
                            if (!self.scope.ngModel)
                                valid = false;
                            else if (!_.isString(self.scope.ngModel))
                                valid = false;
                            else if (self.scope.ngModel === '')
                                valid = false;
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
                    ngListId: '='
                }),
                link: function (scope, element, attrs, ctrl, transclude) {
                    return new DataControl(scope, element, attrs, ctrl, transclude);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlData.html'
            };

        }]);

})();