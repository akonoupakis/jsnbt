/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlTree', function ($timeout) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDomain: '=',
                    ngSelectable: '=',
                    ngSelectMode: '='
                },
                controller: function ($scope) {
                    this.selectable = $scope.ngSelectable;
                    this.selectMode = $scope.ngSelectMode;
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-tree');

                    scope.data = scope.ngModel;

                    scope.$watch('ngModel', function (newValue) {
                        scope.data = newValue;
                    });

                    scope.root = element.parents('.dd-list').length === 0;

                    scope.$on('deleted', function (sender, node) {
                        if (scope.root) {
                            
                            if (node.parent.id === '') {
                                scope.data = _.filter(scope.data, function (x) { return x.id !== node.id; });
                            }

                            sender.stopPropagation();
                        }
                    });
                },
                templateUrl: 'tmpl/partial/controls/ctrlTree.html' 
            };

        })
        .directive('ctrlTreeNode', function ($compile, $location, $q, $fn) {

            return {
                 restrict: 'E',
                 replace: true,
                 scope: {
                     ngModel: '=',
                     ngDomain: '=',
                     ngSelectable: '=',
                     ngSelectMode: '='
                 },
                 link: function (scope, element, attrs) {
                     element.addClass('ctrl-tree-node');

                     scope.node = scope.ngModel;

                     scope.$watch('ngModel', function (newValue) {
                         scope.node = newValue;
                     });

                     var getDomain = function (node) {
                         if (node.entity === 'pointer')
                             return node.pointer.domain;

                         return node.domain;
                     };

                     scope.canCreate = function (node) {
                         return $fn.invoke(node.domain, 'tree.canCreate', [node]);
                     };

                     scope.create = function (node) {
                         $fn.invoke(getDomain(node), 'tree.create', [node]);
                     };

                     scope.canEdit = function (node) {
                         return node.editUrl && node.editUrl !== '';
                     };

                     scope.edit = function (node) {
                         $location.next(node.editUrl);
                     };

                     scope.canDelete = function (node) {
                         return $fn.invoke(getDomain(node), 'tree.canDelete', [node]);
                     };

                     var deleteInternal = function (node) {
                         var deferred = $q.defer();

                         $fn.invoke(getDomain(node), 'tree.delete', [node, function (deleted) {
                             deferred.resolve(deleted);
                         }]);

                         return deferred.promise;
                     };

                     scope.delete = function (node) {
                         $fn.invoke(getDomain(node), 'tree.delete', [node]).then(function (deleted) {
                             if (deleted) {
                                 if (node.parent.id === '') {
                                     scope.$emit('deleted', node);
                                 }
                                 else {
                                     node.parent.children = _.filter(node.parent.children, function (x) { return x.id !== node.id; });
                                     node.parent.childCount = node.parent.children.length;

                                     if (node.parent.childCount === 0)
                                         node.parent.collapsed = true;
                                 }
                             }
                         }, function (ex) {
                             throw ex;
                         });

                     };

                     scope.canPublish = function (node) {
                         return node.draft;
                     };

                     scope.publish = function (node) {
                         $location.next(node.editUrl);
                     };

                     scope.canOpen = function (node) {
                         return node.viewUrl && node.viewUrl !== '';
                     };

                     scope.open = function (node) {
                         //if (scope.selectable)
                         //    scope.$emit('opened', node);
                         //else
                             $location.next(node.viewUrl);
                     };

                     if (scope.selectable) {
                         if (!scope.selectmode)
                             scope.selectmode = 'single';

                         if (['single', 'multiple'].indexOf(scope.selectmode) == -1)
                             scope.selectmode = 'single';
                     }

                     var unselect = function (node) {
                         if (node.selected === true)
                             node.selected = false;

                         $(node.children).each(function (i, item) {
                             unselect(item);
                         });
                     };

                     scope.select = function (node) {
                         if (scope.ngSelectable) {
                             if (scope.ngSelectMode === 'single') {
                                 if (!node.selected) {
                                     var totalParent = node.root ? node : node.parent;
                                    while (!totalParent.root)
                                        totalParent = totalParent.parent;

                                     unselect(totalParent);

                                     node.selected = true;
                                 }
                             }
                             else {
                                 node.selected = !(node.selected || false);
                             }
                         }
                     };

                     if (angular.isArray(scope.node.children)) {
                         var collectionElement = angular.element('<ctrl-tree ng-selectable="ngSelectable" ng-select-mode="ngSelectMode" ng-model="node.children" ng-domain="ngDomain"></nestablelist>');
                         $compile(collectionElement)(scope);
                         element.append(collectionElement);
                     }
                 },
                 templateUrl: 'tmpl/partial/controls/ctrlTreeNode.html'
             };

         });

})();