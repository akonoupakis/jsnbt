/* global angular:false */

(function () {
    "use strict";

    var AppController = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, FileService,NodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.controllers.AppControllerBase.apply(this, $rootScope.getBaseArguments($scope));
      
    };
    AppController.prototype = Object.create(jsnbt.controllers.AppControllerBase.prototype);

    angular.module("jsnbt")
        .controller('AppController', ['$scope', '$rootScope', '$router', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', 'LocationService', 'ScrollSpyService', 'AuthService', 'NodeService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', AppController]);

    var ModalPageController = function ($scope, $rootScope, $router, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, FileService,NodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.controllers.AppControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        $scope.route.on('success', function () {
            var modalElement = $('.modal:last > .modal-dialog > .modal-content > div > .modal-body');
            modalElement.scrollTo(modalElement, { duration: 600 });
        });
    };
    ModalPageController.prototype = Object.create(jsnbt.controllers.AppControllerBase.prototype);

    angular.module("jsnbt")
        .controller('ModalPageController', ['$scope', '$rootScope', '$router', '$logger', '$q', '$timeout', '$data', '$jsnbt', 'LocationService', 'ScrollSpyService', 'AuthService', 'NodeService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', ModalPageController]);
})();