﻿/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controls = (function (controls) {

            controls.ControlBase = (function (ControlBase) {

                ControlBase = function (scope, element, attrs, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {

                    this.scope = scope;
                    this.element = element;
                    this.attrs = attrs;

                    this.ctor = {
                        $rootScope: $rootScope,
                        $router: $router,
                        $location: $location,
                        $logger: $logger,
                        $q: $q,
                        $timeout: $timeout,
                        $data: $data,
                        $jsnbt: $jsnbt,
                        LocationService: LocationService,
                        ScrollSpyService: ScrollSpyService,
                        AuthService: AuthService,
                        TreeNodeService: TreeNodeService,
                        PagedDataService: PagedDataService,
                        ModalService: ModalService,
                        CONTROL_EVENTS: CONTROL_EVENTS,
                        AUTH_EVENTS: AUTH_EVENTS,
                        DATA_EVENTS: DATA_EVENTS,
                        ROUTE_EVENTS: ROUTE_EVENTS,
                        MODAL_EVENTS: MODAL_EVENTS
                    };

                };

                ControlBase.prototype.properties = {};

                ControlBase.prototype.copy = function (sourceScope, sourceKey, targetScope, targetKey) {
                    sourceScope.$watch(sourceKey, function (newValue) {
                        if (!_.isEqual(targetScope[targetKey], newValue))
                            targetScope[targetKey] = newValue;
                    }, true);
                };

                return ControlBase;

            })(controls.ControlBase || {});

            return controls;

        })(jsnbt.controls || {});

        return jsnbt;

    })(jsnbt || {});

})();