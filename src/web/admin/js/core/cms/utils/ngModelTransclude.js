﻿/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
    .directive('ngModelTransclude', [function () {
        return {
            link: function ($scope, $element, $attrs, controller, $transclude) {
                if (!$transclude) {
                    throw minErr('ngTransclude')('orphan',
                     'Illegal use of ngTransclude directive in the template! ' +
                     'No parent directive that requires a transclusion found. ' +
                     'Element: {0}',
                     startingTag($element));
                }
                var innerScope = $scope.$new();
                $transclude(innerScope, function (clone) {
                    $element.empty();
                    $element.append(clone);

                    $scope.$on('$destroy', function () {
                        innerScope.$destroy();
                    });
                });
            }
        };
    }]);

})();