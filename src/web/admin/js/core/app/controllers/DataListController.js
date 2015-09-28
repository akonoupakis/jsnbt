/* global angular:false */

(function () {
    "use strict";

    var DataListController = function ($scope, $rootScope, $routeParams, $location, $logger, $q, $data, $jsnbt, PagedDataService, ModalService, LocationService) {
        jsnbt.DataListControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.domain = 'public';

        var logger = $logger.create('DataListController');
        
        $scope.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    DataListController.prototype = Object.create(jsnbt.DataListControllerBase.prototype);

    angular.module("jsnbt")
        .controller('DataListController', ['$scope', '$rootScope', '$routeParams', '$location', '$logger', '$q', '$data', '$jsnbt', 'PagedDataService', 'ModalService', 'LocationService', DataListController]);
})();