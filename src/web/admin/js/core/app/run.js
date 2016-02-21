(function () {
    "use strict";

    angular.module('jsnbt')
      .run(['$rootScope', '$router', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', 'MODAL_EVENTS',
        function ($rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {

            $rootScope.application = $rootScope.application || {};
            $rootScope.current = $rootScope.current || {};
            $rootScope.defaults = $rootScope.defaults || {};

            $rootScope.getBaseArguments = function () {
                return _.union(arguments, [$rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS]);
            };

            $rootScope.initiated = $rootScope.initiated || false;
            $rootScope.users = 0;

        }]);
})();