/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .constant('MODAL_EVENTS', {
            valueRequested: 'modal-value-requested',
            valueSubmitted: 'modal-value-submitted',
            valueSelected: 'modal-value-selected'
        });
})();