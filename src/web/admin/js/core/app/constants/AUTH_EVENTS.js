(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.constants = (function (constants) {

            constants.AUTH_EVENTS = {
                loginSuccess: 'auth-login-success',
                loginFailed: 'auth-login-failed',
                logoutSuccess: 'auth-logout-success',
                sessionTimeout: 'auth-session-timeout',
                authenticated: 'auth-authenticated',
                notAuthenticated: 'auth-not-authenticated',
                notAuthorized: 'auth-not-authorized',
                noUsers: 'auth-no-users',
                userCreated: 'auth-user-created'
            };

            return constants;

        })(jsnbt.constants || {});

        return jsnbt;

    })(jsnbt || {});

    angular.module("jsnbt")
        .constant('AUTH_EVENTS', jsnbt.constants.AUTH_EVENTS);

})();