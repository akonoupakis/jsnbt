/* global angular:false */
(function () {

    "use strict";
    
    angular.module('jsnbt')
     .directive('popover', [function () {

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs, ctrl, transclude) {
                var popoverBody = $('<div  />')
                    .addClass('webui-popover-content');

                element.after(popoverBody);

                transclude(scope, function (clone, innerScope) {
                    popoverBody.empty();
                    popoverBody.append(clone);

                    element.webuiPopover();
                });
            },
            template: '<span></span>'
        }

    }]);

})();