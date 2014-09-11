/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$user", function () {
            var settings = {};

            return {
                setSettings: function (value) {
                    settings = value;
                },
                $get: function ($q, $http) {

                    var User = {};
                    
                    //User.get = function () {
                    //    //return dpd.users.me
                    //};

                    return User;
                }
            };
        });
})();