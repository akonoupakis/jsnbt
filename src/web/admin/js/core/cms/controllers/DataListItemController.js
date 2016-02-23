/* global angular:false */

(function () {
    "use strict";

    var DataListItemController = function ($scope, $rootScope, $timeout, $q, $logger, $data, $jsnbt, ScrollSpyService, LocationService, CONTROL_EVENTS) {
        jsnbt.controllers.DataFormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        $scope.domain = 'public';

        var logger = $logger.create('DataListItemController');

        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    DataListItemController.prototype = Object.create(jsnbt.controllers.DataFormControllerBase.prototype);

    angular.module("jsnbt")
        .controller('DataListItemController', ['$scope', '$rootScope', '$timeout', '$q', '$logger', '$data', '$jsnbt', 'ScrollSpyService', 'LocationService', 'CONTROL_EVENTS', DataListItemController]);
})();