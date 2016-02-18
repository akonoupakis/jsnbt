/* global angular:false */

(function () {
    "use strict";

    var DataListController = function ($scope, $rootScope, $logger, $q, $data, $jsnbt, PagedDataService, ModalService, LocationService) {
        jsnbt.controllers.DataListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        $scope.domain = 'public';

        var logger = $logger.create('DataListController');
        
        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    DataListController.prototype = Object.create(jsnbt.controllers.DataListControllerBase.prototype);

    angular.module("jsnbt")
        .controller('DataListController', ['$scope', '$rootScope', '$logger', '$q', '$data', '$jsnbt', 'PagedDataService', 'ModalService', 'LocationService', DataListController]);
})();