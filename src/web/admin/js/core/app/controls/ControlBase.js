/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controls = (function (controls) {

            controls.ControlBase = (function (ControlBase) {

                ControlBase = function (scope, element, attrs, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {

                    this.scope = scope;
                    this.element = element;
                    this.attrs = attrs;

                    this.ctor = {
                        $rootScope: $rootScope,
                        $route: $route,
                        $routeParams: $routeParams,
                        $location: $location,
                        $logger: $logger,
                        $q: $q,
                        $timeout: $timeout,
                        $data: $data,
                        $jsnbt: $jsnbt,
                        $fn: $fn,
                        LocationService: LocationService,
                        ScrollSpyService: ScrollSpyService,
                        AuthService: AuthService,
                        TreeNodeService: TreeNodeService,
                        PagedDataService: PagedDataService,
                        ModalService: ModalService,
                        CONTROL_EVENTS: CONTROL_EVENTS,
                        AUTH_EVENTS: AUTH_EVENTS,
                        DATA_EVENTS: DATA_EVENTS,
                        ROUTE_EVENTS: ROUTE_EVENTS
                    };

                };

                return ControlBase;

            })(controls.ControlBase || {});

            return controls;

        })(jsnbt.controls || {});

        return jsnbt;

    })(jsnbt || {});

})();