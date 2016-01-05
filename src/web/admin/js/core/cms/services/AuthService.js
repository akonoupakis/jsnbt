/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('AuthService', ['$q', '$jsnbt', '$http', function ($q, $jsnbt, $http) {
            var AuthService = {};
            
            AuthService.create = function (user) {
                var deferred = $q.defer();

                var url = '../jsnbt-api/core/auth/create';
                $http.post(url, user).then(function (response) {
                    deferred.resolve(response.data);
                }).catch(function (ex) {
                    deferred.reject(ex.data);
                });

                return deferred.promise;
            };

            AuthService.register = function (user) {
                var deferred = $q.defer();

                var url = '../jsnbt-api/core/auth/register';
                $http.post(url, user).then(function (response) {
                    deferred.resolve(response.data);
                }).catch(function (ex) {
                    deferred.reject(ex.data);
                });

                return deferred.promise;
            };

            AuthService.login = function (username, password) {
                var deferred = $q.defer();

                var url = '../jsnbt-api/core/auth/login';
                $http.post(url, {
                    username: username,
                    password: password
                }).then(function (response) {
                    deferred.resolve(response.data);
                }).catch(function (ex) {
                    deferred.reject(ex.data);
                });

                return deferred.promise;
            };

            AuthService.get = function () {
                var deferred = $q.defer();

                var url = '../jsnbt-db/users/me';
                $http.get(url).then(function (response) {
                    deferred.resolve(response.data);
                }).catch(function (ex) {
                    deferred.reject(ex.data);
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

                var url = '../jsnbt-api/core/auth/logout';
                $http.get(url).then(function (data) {
                    deferred.resolve();
                }).catch(function (ex) {
                    deferred.reject(ex);
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

                var url = '../jsnbt-api/core/auth/setPassword';
                $http.post(url, {
                    password: password,
                    newPassword: newPassword
                }).then(function (response) {
                    deferred.resolve(response.data);
                }).catch(function (ex) {
                    deferred.reject(ex.data);
                });

                return deferred.promise;
            };

            AuthService.requestEmailChangeCode = function (email) {
                var deferred = $q.defer();

                var url = '../jsnbt-api/core/auth/requestEmailChange';
                $http.post(url, {
                    email: email
                }).then(function (response) {
                    deferred.resolve(response.data);
                }).catch(function (ex) {
                    deferred.reject(ex.data);
                });

                return deferred.promise;
            };

            AuthService.submitEmailChangeCode = function (email, code) {
                var deferred = $q.defer();

                var url = '../jsnbt-api/core/auth/submitEmailChange';
                $http.post(url, {
                    email: email,
                    code: code
                }).then(function (response) {
                    deferred.resolve(response.data);
                }).catch(function (ex) {
                    deferred.reject(ex.data);
                });

                return deferred.promise;
            };

            return AuthService;
        }]);
})();