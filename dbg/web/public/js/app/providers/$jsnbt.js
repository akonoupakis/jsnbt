/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$jsnbt", function () {

            return {

                $get: function () {

                    return jsnbt;

                }

            };
        });
})();