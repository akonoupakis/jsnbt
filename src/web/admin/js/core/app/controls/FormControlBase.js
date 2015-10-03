/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controls = (function (controls) {

            controls.FormControlBase = function (scope) {
                // controls.ControlBase.apply(this, scope.getBaseArguments(scope));
            };
            controls.FormControlBase.prototype = Object.create(controls.ControlBase.prototype);

            return controls;

        })(jsnbt.controls || {});

        return jsnbt;

    })(jsnbt || {});

})();