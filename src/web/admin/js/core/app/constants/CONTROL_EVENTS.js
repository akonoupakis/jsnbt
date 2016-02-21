(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.constants = (function (constants) {

            constants.CONTROL_EVENTS = {
                register: 'control-register',
                valueChanged: 'control-value-changed',
                initiateValidation: 'control-initiate-validation',
                validate: 'control-validate',
                clearValidation: 'control-clear-validation',
                valueIsValid: 'control-value-valid',
                valueRequested: 'control-value-requested',
                valueSubmitted: 'control-value-submitted',
                valueSelected: 'control-value-selected'
            };

            return constants;

        })(jsnbt.constants || {});

        return jsnbt;

    })(jsnbt || {});

    angular.module("jsnbt")
        .constant('CONTROL_EVENTS', jsnbt.constants.CONTROL_EVENTS);

})();