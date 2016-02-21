(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.constants = (function (constants) {

            constants.MODAL_EVENTS = {
                valueRequested: 'modal-value-requested',
                valueSubmitted: 'modal-value-submitted',
                valueSelected: 'modal-value-selected'
            };

            return constants;

        })(jsnbt.constants || {});

        return jsnbt;

    })(jsnbt || {});

    angular.module("jsnbt")
        .constant('MODAL_EVENTS', jsnbt.constants.MODAL_EVENTS);

})();