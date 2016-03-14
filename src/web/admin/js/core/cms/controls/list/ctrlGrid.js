/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlGrid', ['$rootScope', 'CONTROL_EVENTS', function ($rootScope, CONTROL_EVENTS) {

            var GridControl = function (scope, element, attrs) {
                jsnbt.controls.ListControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));
                
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

                this.init();
            };
            GridControl.prototype = Object.create(jsnbt.controls.ListControlBase.prototype);

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: $.extend(true, jsnbt.controls.ListControlBase.prototype.properties, {
                    ngFn: '='
                }),
                controller: function ($scope) {
                    var self = this;

                    this.selectable = $scope.ngSelectable;
                    this.selectMode = $scope.ngSelectMode;
                    this.language = $scope.ngLanguage;
                    this.sortable = $scope.ngSortable;
                    this.sortableField = $scope.ngSortableField || 'order';

                    this.fn = $scope.ngFn;

                    this.currentPage = 1;

                    $scope.$watch('ngLanguage', function (value) {
                        self.language = value;
                    });

                    $scope.$watch('ngFn', function (value) {
                        self.fn = value;
                    });
                },
                link: function (scope, element, attrs) {
                    var control = new GridControl(scope, element, attrs);
                    scope.$emit(CONTROL_EVENTS.register, control);
                    return control;
                },
                template: '<table class="table table-condensed" ng-class="{\'ctrl-grid-loading\': loading}" ng-transclude></table>'
            };

        }])
        .directive('ctrlGridHeader', [function () {

            return {
                require: '^ctrlGrid',
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<thead><tr ng-transclude></tr></thead>',
                link: function (scope, element, attrs, controller) {
                    element.addClass('ctrl-grid-header');

                    scope.data = scope.$parent.ngModel;

                    if (controller.sortable)
                        element.find('> tr').prepend('<th class="ctrl-grid-sortable"></th>');

                    scope.sort = {
                        name: undefined,
                        direction: 'asc'
                    };

                    scope.$parent.$watch('ngModel', function (newValue, prevValue) {
                        scope.data = newValue;
                    });

                    scope.$parent.$watch('ngFn', function (newValue, prevValue) {
                        scope.fn = newValue;
                    });
                }
            };

        }])
        .directive('ctrlGridHeaderColumn', ['$timeout', function ($timeout) {

            return {
                require: '^ctrlGrid',
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    ngSortName: '=',
                    ngFilterType: '@',
                    ngFilterName: '='
                },
                template: '<th> \
                    <popover ng-if="ngFilterType && ngFilterName" class="filter glyphicon glyphicon-filter" ng-class="{ filtered: filtered() }"> \
                    <div class="ctrl-grid-filter-box ctrl-grid-filter-box-number" ng-class="{ filtered: filtered() }" ng-if="ngFilterType == \'number\'"> \
                        <div ng-repeat="f in filter.expressions track by $index" class="filter-box"> \
                            <span ng-click="nextExpression($index)" class="filter-expression">{{ f.expression }}</span> \
                            <input type="number" ng-model="f.term" /> \
                            <span class="filter-close glyphicon glyphicon-remove-circle" ng-click="removeFilter($index)"></span> \
                        </div> \
                        <div> \
                            <span class="filter-expression">N</span> \
                            <input type="text" ng-disabled="true" /> \
                            <span class="filter-add glyphicon glyphicon-remove-circle" ng-click="addFilter()"></span> \
                        </div> \
                    </div> \
                    <div class="ctrl-grid-filter-box ctrl-grid-filter-box-string" ng-class="{ filtered: filtered() }" ng-if="ngFilterType == \'string\'"> \
                        <div ng-repeat="f in filter.expressions track by $index" class="filter-box"> \
                            <span ng-click="nextExpression($index)" class="filter-expression">{{ f.expression }}</span> \
                            <input type="text" ng-model="f.term" /> \
                            <span class="filter-close glyphicon glyphicon-remove-circle" ng-click="removeFilter($index)"></span> \
                        </div> \
                        <div> \
                            <span class="filter-expression">A</span> \
                            <input type="text" ng-disabled="true" /> \
                            <span class="filter-add glyphicon glyphicon-remove-circle" ng-click="addFilter()"></span> \
                        </div> \
                    </div> \
                    <div class="ctrl-grid-filter-box ctrl-grid-filter-box-date" ng-class="{ filtered: filtered() }" ng-if="ngFilterType == \'date\'"> \
                        <div ng-repeat="f in filter.expressions track by $index" class="filter-box" ng-init="initDate()"> \
                            <span ng-click="nextExpression($index)" class="filter-expression">{{ f.expression }}</span> \
                            <input type="text" ng-model="f.date" /> \
                            <span class="filter-close glyphicon glyphicon-remove-circle" ng-click="removeFilter($index)"></span> \
                        </div> \
                        <div> \
                            <span class="filter-expression">D</span> \
                            <input type="text" ng-disabled="true" /> \
                            <span class="filter-add glyphicon glyphicon-remove-circle" ng-click="addFilter()"></span> \
                        </div> \
                    </div> \
                    <div class="ctrl-grid-filter-box ctrl-grid-filter-box-boolean" ng-class="{ filtered: filtered() }" ng-if="ngFilterType == \'boolean\'"> \
                        <div ng-repeat="f in filter.expressions track by $index" class="filter-box"> \
                            <span ng-click="nextExpression($index)" class="filter-expression">{{ f.expression }}</span> \
                            <span class="checkbox-wrapper"> \
                                <input type="checkbox" ng-model="f.term" /> \
                            </span> \
                            <span class="filter-close glyphicon glyphicon-remove-circle" ng-click="removeFilter($index)"></span> \
                        </div> \
                        <div> \
                            <span class="filter-expression">B</span> \
                            <input type="text" ng-disabled="true" /> \
                            <span class="filter-add glyphicon glyphicon-remove-circle" ng-click="addFilter()" ng-disabled="filter.expressions.length === 1"></span> \
                        </div> \
                    </div> \
                    </popover> \
                    <span ng-class="{sorter: ngSortName, ascending: direction === \'asc\', descending: direction === \'desc\'}" ng-transclude ng-click="sort()"> \
                    </span> \
                </th>',
                link: function (scope, element, attrs, ctrlGrid) {
                    element.addClass('ctrl-grid-header-column');
                    
                    var expressions = [];
                
                    var getSorter = function () {
                        return {
                            name: scope.$parent.$parent.sort.name,
                            direction: scope.$parent.$parent.sort.direction
                        };
                    };

                    var getFilters = function () {
                        var filters = [];

                        var prev = scope.$$prevSibling;
                        while (prev) {
                            if (prev.ngFilterType && prev.ngFilterName && prev.filtered()) {
                                filters.push(prev.filter);
                            }
                            prev = prev.$$prevSibling;
                        };

                        if (scope.ngFilterType && scope.ngFilterName && scope.filtered()) {
                            filters.push(scope.filter);
                        };

                        var next = scope.$$nextSibling;
                        while (next) {
                            if (next.ngFilterType && next.ngFilterName && next.filtered()) {
                                filters.push(next.filter);
                            }
                            next = next.$$nextSibling;
                        };

                        return filters;
                    };

                    scope.direction = undefined;
                    scope.sort = function () {
                        if (!scope.ngSortName)
                            return;

                        if (scope.$parent.$parent.sort.name === scope.ngSortName) {
                            if (scope.$parent.$parent.sort.direction === 'asc')
                                scope.$parent.$parent.sort.direction = 'desc';
                            else
                                scope.$parent.$parent.sort.direction = 'asc';
                        }
                        else {
                            scope.$parent.$parent.sort.name = scope.ngSortName;
                            scope.$parent.$parent.sort.direction = 'asc';
                        }

                        scope.direction = scope.$parent.$parent.sort.direction;

                        var prev = scope.$$prevSibling;
                        while (prev) {
                            prev.direction = undefined;
                            prev = prev.$$prevSibling;
                        };

                        var next = scope.$$nextSibling;
                        while (next) {
                            next.direction = undefined;
                            next = next.$$nextSibling;
                        };

                        ctrlGrid.ended = false;
                        ctrlGrid.currentPage = 1;
                        scope.$parent.$parent.fn.load(getFilters(), getSorter());
                    };

                    scope.filter = {};

                    if (scope.ngFilterType && scope.ngFilterName) {
                        scope.filter.type = scope.ngFilterType;
                        scope.filter.name = scope.ngFilterName;
                        scope.filter.expressions = [];

                        if (scope.ngFilterType === 'number') {
                            expressions = ['=', '!=', '>=', '>', '<', '=<'];

                            scope.$watch('filter.expressions', function (newValue, prevValue) {
                                if (_.isEqual(newValue, prevValue))
                                    return;

                                ctrlGrid.ended = false;
                                ctrlGrid.currentPage = 1;
                                scope.$parent.$parent.fn.load(getFilters(), getSorter());
                            }, true);

                            scope.filtered = function () {
                                return scope.filter.expressions !== undefined && scope.filter.expressions.length > 0;
                            };

                            scope.removeFilter = function (index) {
                                var newValue = [];

                                $(scope.filter.expressions).each(function (i, item) {
                                    if (i !== index) {
                                        newValue.push(item);
                                    }
                                });

                                scope.filter.expressions = newValue;
                            };

                            scope.addFilter = function () {
                                scope.filter.expressions.push({
                                    expression: _.first(expressions),
                                    term: undefined
                                });
                            };
                        }
                        else if (scope.ngFilterType === 'string') {
                            expressions = ['=', '!='];
                    
                            scope.$watch('filter.expressions', function (newValue, prevValue) {
                                if (_.isEqual(newValue, prevValue))
                                    return;

                                ctrlGrid.ended = false;
                                ctrlGrid.currentPage = 1;
                                scope.$parent.$parent.fn.load(getFilters(), getSorter());
                            }, true);
                            
                            scope.filtered = function () {
                                return scope.filter.expressions !== undefined && scope.filter.expressions.length > 0;
                            };

                            scope.removeFilter = function (index) {
                                var newValue = [];

                                $(scope.filter.expressions).each(function (i, item) {
                                    if (i !== index) {
                                        newValue.push(item);
                                    }
                                });

                                scope.filter.expressions = newValue;
                            };

                            scope.addFilter = function () {
                                scope.filter.expressions.push({
                                    expression: _.first(expressions),
                                    term: ''
                                });
                            };
                        }
                        else if (scope.ngFilterType === 'date') {
                            expressions = ['=', '!=', '>=', '>', '<', '=<'];
                
                            scope.filtered = function () {
                                return scope.filter.expressions !== undefined && scope.filter.expressions.length > 0;
                            };

                            scope.removeFilter = function (index) {
                                var newValue = [];

                                $(scope.filter.expressions).each(function (i, item) {
                                    if (i !== index) {
                                        newValue.push(item);
                                    }
                                });

                                scope.filter.expressions = newValue;

                                ctrlGrid.ended = false;
                                ctrlGrid.currentPage = 1;
                                scope.$parent.$parent.fn.load(getFilters(), getSorter());
                            };

                            scope.addFilter = function () {
                                scope.filter.expressions.push({
                                    expression: _.first(expressions),
                                    term: undefined,
                                    date: undefined
                                });

                                $timeout(function () {
                                    var expressionIndex = scope.filter.expressions.length - 1;
                                    var pickerElement = $('.ctrl-grid-filter-box-date .filter-box:eq(' + (expressionIndex) + ') > input');
                                    pickerElement.datepicker({
                                        autoclose: true,
                                        format: 'dd/mm/yyyy',
                                        orientation: 'top'
                                    }).on('changeDate', function (e) {
                                        if (e.date) {
                                            var time = e.date.getTime();
                                            if (scope.filter.expressions[expressionIndex].term !== time) {
                                                scope.filter.expressions[expressionIndex].term = time;
                                                scope.filter.expressions[expressionIndex].date = moment(e.date).format('DD/MM/YYYY');
                                            }
                                        }
                                        else {
                                            scope.filter.expressions[expressionIndex].term = undefined;
                                            scope.filter.expressions[expressionIndex].date = undefined;
                                        }

                                        ctrlGrid.ended = false;
                                        ctrlGrid.currentPage = 1;
                                        scope.$parent.$parent.fn.load(getFilters(), getSorter());
                                    });

                                    scope.$on('$destroy', function () {
                                        pickerElement.datepicker('destroy');
                                    });
                                });
                            };
                        }
                        else if (scope.ngFilterType === 'boolean') {
                            expressions = ['=', '!='];

                            scope.$watch('filter.expressions', function (newValue, prevValue) {
                                if (_.isEqual(newValue, prevValue))
                                    return;

                                ctrlGrid.ended = false;
                                ctrlGrid.currentPage = 1;
                                scope.$parent.$parent.fn.load(getFilters(), getSorter());
                            }, true);

                            scope.filtered = function () {
                                return scope.filter.expressions !== undefined && scope.filter.expressions.length > 0;
                            };

                            scope.removeFilter = function (index) {
                                var newValue = [];

                                $(scope.filter.expressions).each(function (i, item) {
                                    if (i !== index) {
                                        newValue.push(item);
                                    }
                                });

                                scope.filter.expressions = newValue;
                            };

                            scope.addFilter = function () {
                                if (scope.filter.expressions.length === 0) {
                                    scope.filter.expressions.push({
                                        expression: _.first(expressions),
                                        term: false
                                    });
                                }
                            };
                        }

                        scope.nextExpression = function (filterIndex) {
                            var filter = scope.filter.expressions[filterIndex];
                            var expressionIndex = expressions.indexOf(filter.expression);

                            if (expressions.length > (expressionIndex + 1)) {
                                filter.expression = expressions[expressionIndex + 1];
                            }
                            else {
                                filter.expression = _.first(expressions);
                            }

                            ctrlGrid.ended = false;
                            ctrlGrid.currentPage = 1;
                            scope.$parent.$parent.fn.load(getFilters(), getSorter());
                        };
                    }

                    scope.language = ctrlGrid.language;
                }
            };

        }])
        .directive('ctrlGridBodyTransclude', [function () {
            return {
                require: '^ctrlGrid',
                link: function ($scope, $element, $attrs, controller, $transclude) {
                    var innerScope = $scope.$new();
                    $transclude(innerScope, function (clone) {
                        $element.empty();
                        $element.append(clone);

                        if (controller.sortable)
                            $element.prepend('<td class="ctrl-grid-sortable"> \
                                <span class="glyphicon glyphicon-move"></span> \
                            </td>');

                        $scope.$on('$destroy', function () {
                            innerScope.$destroy();
                        });
                    });
                }
            };
        }])
        .directive('ctrlGridBody', [function () {

            return {
                require: '^ctrlGrid',
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<tbody ui-sortable="sortableOptions" ng-model="data.items"><tr ng-class="{\'ng-selected\': model.selected}" ng-repeat="model in data.items" ctrl-grid-body-transclude></tr></tbody>',
                link: function (scope, element, attrs, controller) {
                    element.addClass('ctrl-grid-body');
                    
                    var draggedIndex = -1;

                    scope.sortableOptions = {
                        axis: 'v',

                        helper: function (e, tr) {
                            var $originals = tr.children();
                            var $helper = tr.clone();

                            $helper.children().each(function (i) {
                                $(this).copyCSS($originals.eq(i));
                            });

                            return $helper;
                        },

                        handle: '.glyphicon-move',
                        cancel: '',
                        containment: "parent",
                        start: function (e, ui) {
                            ui.placeholder.height(ui.item.height());

                            draggedIndex = ui.item.index();
                        },
                        stop: function (e, ui) {
                            var newIndex = ui.item.index();
                            if (newIndex !== draggedIndex) {

                                _.each(scope.data.items, function (item, i) {
                                    item[controller.sortableField] = i + 1;
                                });

                                controller.fn.sort(scope.data.items);
                                draggedIndex = -1;
                            }
                        }
                    };
                }
            };

        }])
        .directive('ctrlGridColumn', ['CONTROL_EVENTS', function (CONTROL_EVENTS) {

            return {
                require: '^ctrlGrid',
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<td ng-click="select(model, false)" ng-dblclick="select(model, true)" ng-transclude></td>',
                link: function (scope, element, attrs, ctrlGrid) {
                    element.addClass('ctrl-grid-column');

                    scope.selectable = ctrlGrid.selectable;
                    scope.selectMode = ctrlGrid.selectMode;

                    scope.language = ctrlGrid.language;

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
                                    scope.$emit(CONTROL_EVENTS.valueSelected, item);
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

        }])
        .directive('ctrlGridButtonsColumn', [function () {

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

        }])
        .directive('ctrlGridFooter', [function () {

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

        }])
        .directive('ctrlGridInfiniteScroll', [function () {

            return {
               require: '^ctrlGrid',
               restrict: 'E',
               replace: true,
               template: '<div infinite-scroll="more()"><div class="infinite-loading-bar"><img src="img/core/loading.gif" /></div></div>',
               link: function (scope, element, attrs, ctrlGrid) {
                   element.addClass('ctrl-grid-infinite-scroll');

                   ctrlGrid.ended = false;

                   scope.loading = false;
                   scope.more = function () {
                       if (!ctrlGrid.ended && typeof (scope.$parent.data.more) === 'function' && !scope.loading) {
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
                                   ctrlGrid.ended = true;
                               }
                               scope.$parent.$parent.loading = false;
                           }).catch(function (error) {
                                scope.$parent.$parent.loading = false;
                               throw error;
                           });
                       }
                   };

               }
           };

        }])
        .directive('ctrlGridPager', [function () {

            return {
                require: '^ctrlGrid',
                restrict: 'E',
                replace: true,
                template: '<div><div class="pager-loading-bar"><img src="img/core/loading.gif" /></div><div class="pager-wrapper" paging page="grid.currentPage" page-size="pageSize" total="total" paging-action="setPage(\'Paging Clicked\', page, pageSize, total)" hide-if-empty="true" show-prev-next="true" show-first-last="true"></div></div>',
                link: function (scope, element, attrs, ctrlGrid) {
                    element.addClass('ctrl-grid-pager');

                    ctrlGrid.ended = false;

                    scope.loading = false;

                    scope.grid = ctrlGrid;
                    scope.pageSize = 50;

                    scope.$parent.$watch('data.total', function (newValue) {
                        scope.total = newValue;
                    });

                    scope.setPage = function (event, pageNo, pageSize, totalCount) {
                        if (typeof (scope.$parent.data.get) === 'function' && !scope.loading) {
                            scope.$parent.data.items = [];
                            scope.$parent.$parent.loading = true;
                            scope.$parent.data.get(pageNo).then(function (response) {
                                $(response.items).each(function (i, item) {
                                    item.$parent = scope.$parent.data;
                                    scope.$parent.data.items.push(item);
                                });
                                scope.$parent.data.total = totalCount;
                                ctrlGrid.currentPage = pageNo;
                                scope.$parent.$parent.loading = false;
                            }).catch(function (error) {
                                scope.$parent.$parent.loading = false;
                                throw error;
                            });
                        }
                    };
                    
                }
            };

        }])
        .directive('ctrlGridEmpty', [function () {

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

      }]);
})();
