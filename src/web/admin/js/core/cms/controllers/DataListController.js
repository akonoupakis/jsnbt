/* global angular:false */

(function () {
    "use strict";

    var DataListController = function ($scope, $rootScope, $routeParams, $location, $logger, $q, $data, $jsnbt, PagedDataService, ModalService, LocationService) {
        jsnbt.controllers.DataListControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.domain = 'public';

        var logger = $logger.create('DataListController');
        
        $scope.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    DataListController.prototype = Object.create(jsnbt.controllers.DataListControllerBase.prototype);

    angular.module("jsnbt")
        .controller('DataListController', ['$scope', '$rootScope', '$routeParams', '$location', '$logger', '$q', '$data', '$jsnbt', 'PagedDataService', 'ModalService', 'LocationService', DataListController]);
})();