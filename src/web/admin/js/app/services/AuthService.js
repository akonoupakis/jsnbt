/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('AuthService', function ($q, $jsnbt) {
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

                dpd.users.me(function (userResponse, userError) {
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

                dpd.users.get({}, function (userResponse, userError) {
                    if (userError) {
                        deferred.reject(userError);
                    }
                    else {
                        deferred.resolve(userResponse.length);                        
                    }
                });

                return deferred.promise;
            };

            AuthService.logout = function () {
                var deferred = $q.defer();

                dpd.users.logout(function () {
                    deferred.resolve();
                });

                return deferred.promise;
            };
            
            var getAllRoles = function (role) {
                var results = [];

                var matchedRole = _.first(_.filter($jsnbt.roles, function (x) { return x.name === role; }));
                if (matchedRole) {
                    results.push(role);

                    if (matchedRole.inherits) {
                        $(matchedRole.inherits).each(function (i, item) {
                            var allRoles = getAllRoles(item);
                            $(allRoles).each(function (r, rol) {
                                if (results.indexOf(rol) === -1) {
                                    results.push(rol);
                                }
                            });
                        });
                    }
                }

                return results;
            };
            
            AuthService.getRoles = function (role) {
                return getAllRoles(role);
            };

            AuthService.isInRole = function (user, role) {
                if (!user)
                    return false;

                var result = false;
                
                var roles = user.roles || [];

                var allRoles = [];

                $(roles).each(function (i, item) {
                    var itemRoles = getAllRoles(item);
                    $(itemRoles).each(function (r, rol) {
                        if (allRoles.indexOf(rol) === -1) {
                            allRoles.push(rol);
                        }
                    });
                });

                return allRoles.indexOf(role) !== -1;
            };

            AuthService.authorize = function (user, section) {
                var self = this;

                if (!user)
                    return false;

                var result = false;

                var matchedSection = _.first(_.filter($jsnbt.sections, function (x) { return x.name === section; }));
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

            return AuthService;
        });
})();