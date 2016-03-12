/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
     .directive('ctrlTree', ['$rootScope', 'CONTROL_EVENTS', function ($rootScope, CONTROL_EVENTS) {

         var TreeControl = function (scope, element, attrs, transclude) {
             jsnbt.controls.ListControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

             scope.transcludeFn = scope.ngTranscludeFn || transclude;

             element.addClass('ctrl');
             element.addClass('ctrl-tree');

             scope.language = scope.ngLanguage;

             scope.$watch('ngLanguage', function (value) {
                 scope.language = value;
             });

             var root = scope.ngRoot === undefined || scope.ngRoot === true;
             scope.root = root;

             scope.$watchCollection('ngModel', function (data) {
                 element.empty();
                 
                 $(data).each(function (i, node) {
                     var childScope = scope.$new();
                     childScope.model = node;
                     childScope.ngDomain = scope.ngDomain;
                     childScope.ngSelectable = scope.ngSelectable;
                     childScope.ngSelectMode = scope.ngSelectMode;
                     childScope.ngSelectPointee = scope.ngSelectPointee;
                     childScope.ngTranscludeFn = scope.transcludeFn;
                     childScope.ngFn = scope.ngFn;
                     childScope.ngLanguage = scope.language;
                     childScope.ngRoot = false;
                     childScope.ngSortableEntities = _.union(['root'], scope.ngSortableEntities);

                     if ((scope.ngSortableEntities || []).indexOf(node.entity) !== -1)
                         childScope.ngSortable = scope.ngSortable;
                     else
                         childScope.ngSortable = false;

                     scope.transcludeFn(childScope, function (clone, innerScope) {
                         element.append(clone);

                         scope.$on('$destroy', function () {
                             childScope.$destroy();
                         });
                     });
                 });
             });

             this.init();
         };
         TreeControl.prototype = Object.create(jsnbt.controls.ListControlBase.prototype);

         return {
             restrict: 'E',
             replace: true,
             transclude: true,
             scope: $.extend(true, jsnbt.controls.ListControlBase.prototype.properties, {
                 ngDomain: '=',
                 ngSelectPointee: '=',
                 ngTranscludeFn: '=',
                 ngFn: '=',
                 ngRoot: '='
             }),
             controller: function ($scope) {
                 this.scope = $scope;
             },
             compile: function (elem, attrs, transclude) {
                 return function (scope, lElem, lAttrs) {
                     var control = new TreeControl(scope, lElem, lAttrs, transclude);
                     scope.$emit(CONTROL_EVENTS.register, control);
                     return control;
                 }
             },
             template: '<ol class="dd-list" ng-class="{ \'dd-list-root\': root, \'dd-selectable\': root && ngSelectable }"></ol>'
         };

     }])
     .directive('ctrlTreeNode', ['$compile', function ($compile) {

         return {
             restrict: 'E',
             replace: true,
             transclude: true,
             template: '<li class="dd-item" ng-class="{ \'dd-collapsed\': model.collapsed, \'loading\': model.loading }" ng-transclude></li>',
             compile: function (elem, attrs, transclude) {

                 return function (scope, element, lAttrs) {
                     element.addClass('ctrl-tree-node');

                     var transcludeFn = scope.$parent.transcludeFn;

                     scope.$watch('ngFn', function (value) {
                         scope.fn = value;
                     });

                     scope.$watchCollection('model.children', function (value) {
                         element.empty();

                         element.get(0).model = scope.model;

                         transclude(scope, function (clone, innerScope) {
                             //if (scope.$parent.ngSortable && (scope.ngSortableEntities || []).indexOf(scope.model.parent.entity) !== -1)
                             //    element.append($compile(angular.element('<span class="dd-sortable"><span class="glyphicon glyphicon-move"></span></span>'))(innerScope));

                             element.append($compile(angular.element('<button type="button" class="dd-collapse" ng-show="model.expandable && !model.root && model.childCount !== 0" ng-click="model.collapse()">Collapse</button>'))(innerScope));
                             element.append($compile(angular.element('<button type="button" class="dd-expand" ng-show="model.expandable && !model.root && model.childCount !== 0" ng-click="model.expand()">Expand</button>'))(innerScope));
                             element.append($compile(angular.element('<img class="dd-loading" src="img/core/node-loading.gif" />'))(innerScope));
                             element.append(clone);

                             var childScope = innerScope.$new();
                             childScope.ngModel = value;
                             childScope.ngDomain = innerScope.$parent.ngDomain;
                             childScope.ngSelectable = innerScope.$parent.ngSelectable;
                             childScope.ngSelectMode = innerScope.$parent.ngSelectMode;
                             childScope.ngSelectPointee = innerScope.$parent.ngSelectPointee;
                             childScope.ngLanguage = innerScope.$parent.language;
                             childScope.ngTranscludeFn = transcludeFn;
                             childScope.ngRoot = false;
                             childScope.ngFn = innerScope.$parent.ngFn;
                             
                             var collectionElement = angular.element('<ctrl-tree ng-model="ngModel" ng-domain="ngDomain" ng-root="ngRoot" ng-selectable="ngSelectable" ng-select-mode="ngSelectMode" ng-select-pointee="ngSelectPointee" ng-transclude-fn="ngTranscludeFn" ng-fn="ngFn" ng-language="ngLanguage"></ctrl-tree>');
                             var compiled = $compile(collectionElement)(childScope);
                             element.append(compiled);

                             innerScope.$on('$destroy', function () {
                                 childScope.$destroy();
                             });
                         });
                     });

                 };
             }
         };

     }])
     .directive('ctrlTreeNodeContent', ['$jsnbt', 'CONTROL_EVENTS', function ($jsnbt, CONTROL_EVENTS) {

         return {
             restrict: 'E',
             replace: true,
             transclude: true,
             link: function (scope, element, attrs) {
                 element.addClass('ctrl-tree-node-content');

                 scope.language = scope.ngLanguage;

                 scope.$watch('ngLanguage', function (value) {
                     scope.language = value;
                 });

                 var selectMode = scope.ngSelectMode || 'single';
                 if (scope.ngSelectable) {
                     if (['single', 'multiple'].indexOf(selectMode) === -1)
                         selectMode = 'single';
                 }

                 var unselect = function (node) {
                     if (node.selected === true)
                         node.selected = false;

                     $(node.children).each(function (i, item) {
                         unselect(item);
                     });
                 };
                                  
                 scope.select = function (node, double) {
                     if (node) {
                         if (scope.ngSelectable) {
                             
                             if (scope.ngSelectPointee) {
                                 if ($jsnbt.entities[node.entity].pointed !== true) {
                                     return;
                                 }
                             }

                             if (selectMode === 'single') {
                                 var totalParent = node.root ? node : node.parent;
                                 if (double) {
                                        while (!totalParent.root)
                                            totalParent = totalParent.parent;

                                        unselect(totalParent);

                                        node.selected = true;
                                        scope.$emit(CONTROL_EVENTS.valueSelected, node);
                                 }
                                 else {
                                     if (!node.selected) {
                                         while (!totalParent.root)
                                             totalParent = totalParent.parent;

                                         unselect(totalParent);

                                         node.selected = true;
                                     }
                                 }
                             }
                             else {
                                 node.selected = !(node.selected || false);
                             }
                         }
                     }
                 };
             },
             template: '<div class="dd-content" ng-class="{ \'dd-selected\': model.selected }"><div ng-click="select(model, false)" ng-dblclick="select(model, true)" ng-transclude></div></div>'
         };

     }])
     .directive('ctrlTreeNodeButtons', [function () {

         return {
             restrict: 'E',
             replace: true,
             transclude: true,
             link: function (scope, element, attrs) {
                 element.addClass('ctrl-tree-node-buttons');
             },
             template: '<div class="dd-buttons" ng-transclude></div>'
         };

     }])
     .directive('ctrlTreeEmpty', [function () {

         return {
             restrict: 'E',
             replace: true,
             transclude: true,
             scope: {
                 ngModel: '='
             },
             template: '<div class="dd-list-empty" ng-show="data.length === 0"><span ng-transclude></span></div>',
             link: function (scope, element, attrs) {
                 element.addClass('ctrl-tree-empty');

                 scope.$watch('ngModel', function (newValue) {
                     scope.data = newValue || [];
                 });

             }
         };

     }]);

})();