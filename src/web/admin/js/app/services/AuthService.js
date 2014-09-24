/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('AuthService', function ($q) {
            var AuthService = {};
            
            AuthService.login = function (username, password) {
                var deferred = $q.defer();

                dpd.users.login({
                    username: username,
                    password: password
                }, function (response, error) {
                    if (error) {
                        deferred.reject(error);
                    }
                    else {
                        if (response.id) {
                            dpd.users.me(function (userResponse, userError) {
                                if (userError) {
                                    deferred.reject(userError);
                                }
                                else {
                                    deferred.resolve(userResponse);
                                }
                            });
                        }
                        else {
                            deferred.reject(response);
                        }
                    }
                });

                return deferred.promise;
            };
            
            return AuthService;
        });
})();