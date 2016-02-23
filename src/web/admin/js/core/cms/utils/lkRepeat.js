/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
    .directive('lkRepeat', [function () {
        return {
            transclude: 'element',
            compile: function (element, attr, linker) {
                return function ($scope, $element, $attr) {
                    var myLoop = $attr.lkRepeat,
                        match = myLoop.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/),
                        modelString = match[1],
                        collectionString = match[2],
                        parent = $element.parent(),
                        elements = [];

                    $scope.$watchCollection(collectionString, function (collection) {
                        var i, block, childScope;

                        if (elements.length > 0) {
                            for (i = 0; i < elements.length; i++) {
                                elements[i].el.remove();
                                elements[i].scope.$destroy();
                            };
                            elements = [];
                        }

                        if (!collection)
                            collection = [];

                        if (_.isArray(collection)) {
                            for (i = 0; i < collection.length; i++) {

                                childScope = $scope.$new();
                                childScope[modelString] = collection[i];
                                childScope['$index'] = i;

                                linker(childScope, function (clone) {
                                    parent.append(clone); // add to DOM
                                    block = {};
                                    block.el = clone;
                                    block.scope = childScope;
                                    elements.push(block);

                                    $scope.$on('$destroy', function () {
                                        childScope.$destroy();
                                    });
                                });

                            };
                        }
                    });
                }
            }
        }
    }]);

})();