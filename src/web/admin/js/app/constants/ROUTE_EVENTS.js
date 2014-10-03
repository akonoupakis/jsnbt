/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .constant('ROUTE_EVENTS', {
            routeStarted: 'route-started',
            routeCompleted: 'route-completed'
        });
})();