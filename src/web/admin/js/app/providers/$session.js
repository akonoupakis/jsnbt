/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$session", function () {
            var settings = {};

            return {
                setSettings: function (value) {
                    settings = value;
                },
                $get: function ($q, $http) {

                    var Session = {};
                    
                    return Session;
                }
            };
        });
})();