/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlGrid', function ($compile) {

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    ngModel: '=',
                    ngSelectable: '=',
                    ngSelectMode: '='
                },
                controller: function ($scope) {
                    this.selectable = $scope.ngSelectable;
                    this.selectMode = $scope.ngSelectMode;
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-grid');

                    scope.loading = true;

                    scope.$watch('ngModel', function (newValue, prevValue) {
                        if (newValue.items)
                            scope.loading = false;
                    });
                },
                templateUrl: 'tmpl/partial/controls/ctrlGrid.html'
            };

        })
        .directive('ctrlGridHeader', function ($compile) {

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<thead><tr ng-transclude></tr></thead>',
                link: function (scope, element, attrs) {
                    element.addClass('ctrl-grid-header');
                }
            };

        })
        .directive('ctrlGridHeaderColumn', function ($compile) {

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<th ng-transclude></th>',
                link: function (scope, element, attrs) {
                    element.addClass('ctrl-grid-header-column');
                }
            };

        })
        .directive('ctrlGridBody', function () {

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<tbody><tr ng-class="{\'ng-selected\': data.selected}" ng-repeat="data in data.items" ng-inject></tr></tbody>',
                link: function (scope, element, attrs) {
                    element.addClass('ctrl-grid-body');
                }
            };

        })
        .directive('ctrlGridColumn', function () {

            return {
                require: '^ctrlGrid',
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<td ng-click="select(data)" ng-transclude></td>',
                link: function (scope, element, attrs, ctrlGrid) {
                    element.addClass('ctrl-grid-column');
                    
                    scope.selectable = ctrlGrid.selectable;
                    scope.selectMode = ctrlGrid.selectMode;

                    scope.select = function (item) {
                        if (ctrlGrid.selectable) {
                            if (ctrlGrid.selectMode === 'multiple') {
                                item.selected = !item.selected;
                            }
                            else {
                                if (!item.selected) {
                                    $(item.$parent.items).each(function (d, ditem) {
                                        if (ditem.selected)
                                            ditem.selected = false;
                                    });
                                    item.selected = true;
                                }
                            }
                        }
                    };
                }
            };

        })
        .directive('ctrlGridButtonsColumn', function () {

            return {
                require: '^ctrlGrid',
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<td ng-transclude></td>',
                link: function (scope, element, attrs, ctrlGrid) {
                    element.addClass('ctrl-grid-buttons-column');

                    scope.selectable = ctrlGrid.selectable;
                    scope.selectMode = ctrlGrid.selectMode;
                }
            };

        })
        .directive('ctrlGridFooter', function ($compile) {

           return {
               restrict: 'E',
               replace: true,
               transclude: true,
               template: '<tfoot><tr ng-transclude></tr></tfoot>',
               link: function (scope, element, attrs) {
                   element.addClass('ctrl-grid-footer');

                   scope.data = scope.$$prevSibling.ngModel;

                   scope.$$prevSibling.$watch('ngModel', function (newValue, prevValue) {
                       scope.data = newValue;
                   });
               }
           };

       })
        .directive('ctrlGridInfiniteScroll', function ($compile) {

            return {
                restrict: 'E',
                replace: true,
                template: '<div infinite-scroll="more()"><div class="infinite-loading-bar"><img src="img/loading.gif" /></div></div>',
                link: function (scope, element, attrs) {
                    element.addClass('ctrl-grid-infinite-scroll');

                    scope.ended = false;

                    scope.loading = false;
                    scope.more = function () {
                        if (!scope.ended && typeof (scope.$parent.data.more) === 'function' && !scope.loading) {
                            scope.loading = true;
                            scope.$parent.$$prevSibling.loading = true;
                            scope.$parent.$parent.$$prevSibling.loading = true;
                            scope.$parent.data.more().then(function (response) {
                                if (response.items.length > 0) {
                                    scope.$parent.data.more = response.more;
                                    $(response.items).each(function (i, item) {
                                        item.$parent = scope.$parent.data;
                                        scope.$parent.data.items.push(item);
                                    });
                                }
                                else {
                                    scope.ended = true;
                                }
                                scope.$parent.$$prevSibling.loading = false;
                                scope.$parent.$parent.$$prevSibling.loading = false;
                                scope.loading = false;
                            }, function (error) {
                                scope.$parent.$$prevSibling.loading = false;
                                scope.$parent.$parent.$$prevSibling.loading = false;
                                scope.loading = false;
                                throw error;
                            });
                        }
                    };

                }
            };

        });
})();
