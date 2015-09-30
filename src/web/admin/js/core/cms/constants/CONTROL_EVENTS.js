/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .constant('CONTROL_EVENTS', {
            valueChanged: 'control-value-changed',
            initiateValidation: 'control-initiate-validation',
            valueIsValid: 'control-value-valid',
            valueRequested: 'control-value-requested',
            valueSubmitted: 'control-value-submitted',
            valueSelected: 'control-value-selected'
        });
})();