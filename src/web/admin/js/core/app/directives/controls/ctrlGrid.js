/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlGrid', function () {

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    ngModel: '=',
                    ngSelectable: '=',
                    ngSelectMode: '=',
                    ngFn: '='
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

                    scope.$watch('ngFn', function (newValue, prevValue) {
                     
                        scope.fn = newValue;
                    });
                },
                template: '<table class="table table-condensed" ng-class="{\'ctrl-grid-loading\': loading}" ng-transclude></table>'
            };

        })
        .directive('ctrlGridHeader', function () {

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<thead ng-show="data.items.length !== 0"><tr ng-transclude></tr></thead>',
                link: function (scope, element, attrs) {
                    element.addClass('ctrl-grid-header');

                    scope.data = scope.$parent.ngModel;

                    scope.$parent.$watch('ngModel', function (newValue, prevValue) {
                        scope.data = newValue;
                    });

                    scope.$parent.$watch('ngFn', function (newValue, prevValue) {
                        scope.fn = newValue;
                    });
                }
            };

        })
        .directive('ctrlGridHeaderColumn', function () {

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
                template: '<tbody><tr ng-class="{\'ng-selected\': row.selected}" ng-repeat="row in data.items" ng-inject></tr></tbody>',
                link: function (scope, element, attrs) {
                    element.addClass('ctrl-grid-body');
                }
            };

        })
        .directive('ctrlGridColumn', function (MODAL_EVENTS) {

            return {
                require: '^ctrlGrid',
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<td ng-click="select(row, false)" ng-dblclick="select(row, true)" ng-transclude></td>',
                link: function (scope, element, attrs, ctrlGrid) {
                    element.addClass('ctrl-grid-column');

                    scope.selectable = ctrlGrid.selectable;
                    scope.selectMode = ctrlGrid.selectMode;

                    scope.select = function (item, double) {
                        if (ctrlGrid.selectable) {
                            if (ctrlGrid.selectMode === 'multiple') {
                                item.selected = !item.selected;
                            }
                            else {
                                if (double) {
                                    $(item.$parent.items).each(function (d, ditem) {
                                        if (ditem.selected)
                                            ditem.selected = false;
                                    });
                                    item.selected = true;
                                    scope.$emit(MODAL_EVENTS.valueSelected, item);
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
        .directive('ctrlGridFooter', function () {

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<tfoot><tr><td colspan="1000" ng-transclude></td></tr></tfoot>',
                link: function (scope, element, attrs) {
                    element.addClass('ctrl-grid-footer');

                    scope.data = scope.$parent.ngModel;

                    scope.$parent.$watch('ngModel', function (newValue, prevValue) {
                        scope.data = newValue;
                    });
                }
            };

        })
       .directive('ctrlGridInfiniteScroll', function () {

           return {
               restrict: 'E',
               replace: true,
               template: '<div infinite-scroll="more()"><div class="infinite-loading-bar"><img src="img/core/loading.gif" /></div></div>',
               link: function (scope, element, attrs) {
                   element.addClass('ctrl-grid-infinite-scroll');

                   scope.ended = false;

                   scope.loading = false;
                   scope.more = function () {
                       if (!scope.ended && typeof (scope.$parent.data.more) === 'function' && !scope.loading) {
                           scope.$parent.$parent.loading = true;
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
                               scope.$parent.$parent.loading = false;
                           }, function (error) {
                                scope.$parent.$parent.loading = false;
                               throw error;
                           });
                       }
                   };

               }
           };

       })
      .directive('ctrlGridEmpty', function () {

          return {
              restrict: 'E',
              replace: true,
              transclude: true,
              template: '<div ng-show="data.items.length === 0"><span ng-transclude /></div>',
              link: function (scope, element, attrs) {
                  element.addClass('ctrl-grid-empty');

                  scope.data = scope.$parent.data;

                  scope.$parent.$watch('data', function (newValue, prevValue) {
                      scope.data = newValue;
                  });
              }
          };

      });
})();
