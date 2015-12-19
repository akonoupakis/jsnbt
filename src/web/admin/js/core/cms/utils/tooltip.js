/* global angular:false */
(function () {

    "use strict";
    
    angular.module('jsnbt')
        .directive('tooltip', [function () {

            return {
                restrict: 'EA',
                link: function (scope, element, attrs) {
                    attrs.tooltipPlacement = attrs.tooltipPlacement || 'left';
                    attrs.tooltipAnimation = 'false';
                    attrs.tooltipPopupDelay = attrs.tooltipPopupDelay || 0;
                    attrs.tooltipTrigger = attrs.tooltipTrigger || '';
                    attrs.tooltipAppendToBody = attrs.tooltipAppendToBody || false;
                }
            }

        }]);

})();