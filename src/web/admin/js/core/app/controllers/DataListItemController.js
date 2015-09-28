/* global angular:false */

(function () {
    "use strict";

    var DataListItemController = function ($scope, $rootScope, $routeParams, $location, $timeout, $q, $logger, $data, $jsnbt, ScrollSpyService, LocationService, CONTROL_EVENTS) {
        jsnbt.DataFormControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.domain = 'public';

        var logger = $logger.create('DataListItemController');

        $scope.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    DataListItemController.prototype = Object.create(jsnbt.DataFormControllerBase.prototype);

    angular.module("jsnbt")
        .controller('DataListItemController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$q', '$logger', '$data', '$jsnbt', 'ScrollSpyService', 'LocationService', 'CONTROL_EVENTS', DataListItemController]);
})();