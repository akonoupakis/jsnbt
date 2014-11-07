/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$jsnbt", function () {
            var settings = {};

            return {

                setSettings: function (value) {
                    settings = value;
                },

                $get: function () {

                    return settings;

                }

            };
        });
})();