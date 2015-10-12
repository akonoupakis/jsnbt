/* global angular:false */

(function () {
    "use strict";

    var modules = [];
    modules.push('ngRoute');
    modules.push('ngAnimate');
    modules.push('ngSanitize');
    modules.push('mgcrea.ngStrap');
    modules.push('ui.bootstrap');
    modules.push('ui.sortable');
    modules.push('infinite-scroll');
    modules.push('flow');
    modules.push('angular-redactor');

    for (var moduleDomain in jsnbt.modules) {
        if (jsnbt.modules[moduleDomain].domain !== 'public' && jsnbt.modules[moduleDomain].name)
            modules.push(jsnbt.modules[moduleDomain].name);
    }

    angular.module('jsnbt', modules)
        .run(['$rootScope', '$route', '$routeParams', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', 'MODAL_EVENTS',
        function ($rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {

            $rootScope.application = $rootScope.application || {};
            $rootScope.current = $rootScope.current || {};
            $rootScope.defaults = $rootScope.defaults || {};

            $rootScope.getBaseArguments = function () {
                return _.union(arguments, [$rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS]);
            };

        }]);
})();