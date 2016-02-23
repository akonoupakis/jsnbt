/* global angular:false */

(function () {
    "use strict";

    var AppController = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.controllers.AppControllerBase.apply(this, $rootScope.getBaseArguments($scope));
      
    };
    AppController.prototype = Object.create(jsnbt.controllers.AppControllerBase.prototype);

    angular.module("jsnbt")
        .controller('AppController', ['$scope', '$rootScope', '$router', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', AppController]);

})();