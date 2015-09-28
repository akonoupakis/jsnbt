/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$logger", [function () {
            var settings = {};

            return {
                setSettings: function (value) {
                    settings = value;
                },
                $get: function ($q, $http) {

                    var Logger = {};
                    
                    Logger.create = function (name) {

                        return {
                            info: function () {
                                console.log(name, arguments);
                            },
                            warn: function (warning) {
                                console.warn(warning);
                            },
                            error: function (ex) {
                                throw ex;
                            }
                        };

                    };

                    return Logger;
                }
            };
        }]);
})();