/* global angular:false */
(function () {

    "use strict";
    
    angular.module('jsnbt')
        .directive('errSrc', [function () {

            return {
                link: function (scope, element, attrs) {

                    scope.$watch(function () {
                        return attrs['ngSrc'];
                    }, function (value) {
                        if (!value) {
                            element.attr('src', attrs.errSrc);
                        }
                    });

                    element.bind('error', function () {
                        element.attr('src', attrs.errSrc);
                    });
                }
            }

        }]);

})();