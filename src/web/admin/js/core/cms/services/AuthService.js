﻿/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('AuthService', ['$q', '$jsnbt', function ($q, $jsnbt) {
            var AuthService = {};
            
            AuthService.login = function (username, password) {
                var deferred = $q.defer();

                jsnbt.db.users.login({
                    username: username,
                    password: password
                }, function (error, response) {
                    if (error) {
                        deferred.reject(error);
                    }
                    else {
                        if (response.id) {
                            jsnbt.db.users.me(function (userError, userResponse) {
                                if (userError) {
                                    deferred.reject(userError);
                                }
                                else {
                                    if (userResponse)
                                        deferred.resolve(userResponse);
                                    else
                                        deferred.reject();
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

            AuthService.get = function () {
                var deferred = $q.defer();

                jsnbt.db.users.me(function (userError, userResponse) {
                    if (userError) {
                        deferred.reject(userError);
                    }
                    else {
                        if (userResponse)
                            deferred.resolve(userResponse);
                        else
                            deferred.reject();
                    }
                });

                return deferred.promise;
            };

            AuthService.count = function () {
                var deferred = $q.defer();

                jsnbt.db.users.count({}, function (userError, userResponse) {
                    if (userError) {
                        deferred.reject(userError);
                    }
                    else {
                        deferred.resolve(userResponse.count);                        
                    }
                });

                return deferred.promise;
            };

            AuthService.logout = function () {
                var deferred = $q.defer();

                jsnbt.db.users.logout(function () {
                    deferred.resolve();
                });

                return deferred.promise;
            };
            
            AuthService.isInRole = function (user, role) {
                return $jsnbt.auth.isInRole(user, role);
            };

            AuthService.isAuthorized = function (user, section, permission) {
                var self = this;

                if (permission) {
                    return $jsnbt.auth.isAuthorized(user, section, permission);
                }
                else {
                    if (!user)
                        return false;

                    var result = false;

                    var matchedSection = $jsnbt.sections[section];
                    if (matchedSection && matchedSection.roles) {
                        $(matchedSection.roles).each(function (r, role) {
                            if (self.isInRole(user, role)) {
                                result = true;
                                return false;
                            }
                        });
                    }

                    return result;
                }
            };

            return AuthService;
        }]);
})();