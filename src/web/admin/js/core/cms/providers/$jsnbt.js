/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$jsnbt", ['$routeProvider', function ($routeProvider) {
            var settings = {};
            
            return {

                setSettings: function (value) {
                    settings = value;
                },

                $get: function () {

                    return settings;

                }

            };
        }]);
})();