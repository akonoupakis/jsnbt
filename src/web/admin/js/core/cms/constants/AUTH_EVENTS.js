/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            authenticated: 'auth-authenticated',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized',
            noUsers: 'auth-no-users',
            userCreated: 'auth-user-created'
        });
})();