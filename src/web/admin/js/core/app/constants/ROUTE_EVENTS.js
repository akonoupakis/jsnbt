(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.constants = (function (constants) {

            constants.ROUTE_EVENTS = {
                routeStarted: 'route-started',
                routeCompleted: 'route-completed'
            };

            return constants;

        })(jsnbt.constants || {});

        return jsnbt;

    })(jsnbt || {});

    angular.module("jsnbt")
        .constant('ROUTE_EVENTS', jsnbt.constants.ROUTE_EVENTS);

})();