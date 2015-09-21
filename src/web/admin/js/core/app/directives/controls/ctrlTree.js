/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
     .directive('ctrlTree', [function () {

         return {
             restrict: 'E',
             replace: true,
             transclude: true,
             scope: {
                 language: '=',
                 ngModel: '=',
                 ngDomain: '=',
                 ngSelectable: '=',
                 ngSelectMode: '=',
                 ngTranscludeFn: '=',
                 ngFn: '=',
                 ngRoot: '='
             },
             template: '<ol class="dd-list" ng-class="{ \'dd-list-root\': root, \'dd-selectable\': root && ngSelectable }"></ol>',
             compile: function (elem, attrs, transclude) {

                 return function (scope, lElem, lAttrs) {
                     scope.transcludeFn = scope.ngTranscludeFn || transclude;

                     lElem.addClass('ctrl');
                     lElem.addClass('ctrl-tree');

                     var root = scope.ngRoot === undefined || scope.ngRoot === true;
                     scope.root = root;

                     scope.$watch('ngModel', function (data) {
                         lElem.empty();
                         $(data).each(function (i, node) {
                             var childScope = scope.$new();
                             childScope.node = node;
                             childScope.ngDomain = scope.ngDomain;
                             childScope.ngSelectable = scope.ngSelectable;
                             childScope.ngSelectMode = scope.ngSelectMode;
                             childScope.ngTranscludeFn = scope.transcludeFn;
                             childScope.ngFn = scope.ngFn;
                             childScope.language = scope.language;
                             childScope.ngRoot = false;

                             scope.transcludeFn(childScope, function (clone, innerScope) {
                                 lElem.append(clone);
                             });
                         });
                     });
                 };
             }
         };

     }])
     .directive('ctrlTreeNode', ['$compile', function ($compile) {

         return {
             restrict: 'E',
             replace: true,
             transclude: true,
             template: '<li class="dd-item" ng-class="{ \'dd-collapsed\': node.collapsed, \'loading\': node.loading }" ng-transclude></li>',
             compile: function (elem, attrs, transclude) {

                 return function (scope, lElem, lAttrs) {
                     lElem.addClass('ctrl-tree-node');

                     var transcludeFn = scope.$parent.transcludeFn;

                     scope.$watch('ngFn', function (value) {
                         scope.fn = value;
                     });

                     scope.$watch('node.children', function (value) {
                         lElem.empty();

                         transclude(scope, function (clone, innerScope) {
                             lElem.append($compile(angular.element('<button type="button" class="dd-collapse" ng-show="node.expandable && !node.root && node.childCount !== 0" ng-click="node.collapse()">Collapse</button>'))(innerScope));
                             lElem.append($compile(angular.element('<button type="button" class="dd-expand" ng-show="node.expandable && !node.root && node.childCount !== 0" ng-click="node.expand()">Expand</button>'))(innerScope));
                             lElem.append($compile(angular.element('<img class="dd-loading" src="img/core/node-loading.gif" />'))(innerScope));
                             lElem.append(clone);

                             var childScope = scope.$new();
                             childScope.ngModel = value;
                             childScope.ngDomain = scope.$parent.ngDomain;
                             childScope.ngSelectable = scope.$parent.ngSelectable;
                             childScope.ngSelectMode = scope.$parent.ngSelectMode;
                             childScope.ngTranscludeFn = transcludeFn;
                             childScope.ngRoot = false;
                             childScope.ngFn = scope.$parent.ngFn;

                             var collectionElement = angular.element('<ctrl-tree ng-model="ngModel" ng-domain="ngDomain" ng-root="ngRoot" ng-selectable="ngSelectable" ng-select-mode="ngSelectMode" ng-transclude-fn="ngTranscludeFn" ng-fn="ngFn" language="language"></ctrl-tree>');
                             var compiled = $compile(collectionElement)(childScope);
                             lElem.append(compiled);
                         });
                     });

                 };
             }
         };

     }])
     .directive('ctrlTreeNodeContent', ['CONTROL_EVENTS', function (CONTROL_EVENTS) {

         return {
             restrict: 'E',
             replace: true,
             transclude: true,
             link: function (scope, element, attrs) {
                 element.addClass('ctrl-tree-node-content');

                 var selectMode = scope.ngSelectMode || 'single';
                 if (scope.ngSelectable) {
                     if (['single', 'multiple'].indexOf(selectMode) == -1)
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
                             if (selectMode === 'single') {
                                 if (double) {
                                        var totalParent = node.root ? node : node.parent;
                                        while (!totalParent.root)
                                            totalParent = totalParent.parent;

                                        unselect(totalParent);

                                        node.selected = true;
                                        scope.$emit(CONTROL_EVENTS.valueSelected, node);
                                 }
                                 else {
                                     if (!node.selected) {
                                         var totalParent = node.root ? node : node.parent;
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
             template: '<div class="dd-content" ng-class="{ \'dd-selected\': node.selected }"><div ng-click="select(node, false)" ng-dblclick="select(node, true)" ng-transclude></div></div>'
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