/* global angular:false */

(function () {
    "use strict";

    var PageController = function ($scope, $rootScope, $router, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {

        $scope.route.on('success', function () {
            $('body').scrollTo($('body'), { duration: 400 });
        });

    };

    angular.module("jsnbt")
        .controller('PageController', ['$scope', '$rootScope', '$router', '$logger', '$q', '$timeout', '$data', '$jsnbt', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', PageController]);
})();