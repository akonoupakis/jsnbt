/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('UserService', function ($q) {
            var UserService = {};

            UserService.getCurrent = function () {
                throw new Error('not implemented');
            };

            return UserService;
        });
})();