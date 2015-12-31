/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('AuthService', ['$q', '$jsnbt', '$http', function ($q, $jsnbt, $http) {
            var AuthService = {};
            
            AuthService.login = function (username, password) {
                var deferred = $q.defer();

                var url = '../jsnbt-api/core/auth/login';
                $http.post(url, {
                    username: username,
                    password: password
                }).then(function (data) {
                    var response = data.data;

                    if (response.id) {
                        deferred.resolve(response);
                    }
                    else {
                        deferred.reject(response);
                    }

                }).catch(function (ex) {
                    deferred.reject(ex);
                });

                //jsnbt.db.users.login({
                //    username: username,
                //    password: password
                //}, function (error, response) {
                //    if (error) {
                //        deferred.reject(error);
                //    }
                //    else {
                //        if (response.id) {
                //            jsnbt.db.users.me(function (userError, userResponse) {
                //                if (userError) {
                //                    deferred.reject(userError);
                //                }
                //                else {
                //                    if (userResponse)
                //                        deferred.resolve(userResponse);
                //                    else
                //                        deferred.reject();
                //                }
                //            });
                //        }
                //        else {
                //            deferred.reject(response);
                //        }
                //    }
                //});

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

            AuthService.setPassword = function (password, newPassword) {
                var deferred = $q.defer();

                var url = '../jsnbt-db/users/passwd';
                $http.post(url, {
                    password: password,
                    newPassword: newPassword
                }).then(function (data) {
                    deferred.resolve(data.data);
                }).catch(function (ex) {
                    deferred.reject(ex);
                });

                return deferred.promise;
            };

            AuthService.requestEmailChangeCode = function (email) {
                var deferred = $q.defer();

                var url = '../jsnbt-api/core/auth/remail';
                $http.post(url, {
                    email: email
                }).then(function (data) {
                    deferred.resolve(data.data);
                }).catch(function (ex) {
                    deferred.reject(ex);
                });

                return deferred.promise;
            };

            AuthService.submitEmailChangeCode = function (email, code) {
                var deferred = $q.defer();

                var url = '../jsnbt-api/core/auth/semail';
                $http.post(url, {
                    email: email,
                    code: code
                }).then(function (data) {
                    deferred.resolve(data.data);
                }).catch(function (ex) {
                    deferred.reject(ex);
                });

                return deferred.promise;
            };

            return AuthService;
        }]);
})();