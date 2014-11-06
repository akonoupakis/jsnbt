/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .constant('FORM_EVENTS', {
            valueChanged: 'form-value-changed',
            initiateValidation: 'form-initiate-validation',
            valueIsValid: 'form-value-valid'
        });
})();