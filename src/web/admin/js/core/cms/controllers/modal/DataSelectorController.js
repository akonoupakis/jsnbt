;(function () {
    "use strict";

    var DataSelectorController = function ($scope, $rootScope, $data, $logger, PagedDataService, CONTROL_EVENTS, MODAL_EVENTS) {
        jsnbt.controllers.ListSelectorModalControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('DataSelectorController');

        if (!$scope.domain)
            throw new Error('$scope.domain not defined in DataSelectorController');
        
        if (!$scope.list)
            throw new Error('$scope.list not defined in DataSelectorController');

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    DataSelectorController.prototype = Object.create(jsnbt.controllers.ListSelectorModalControllerBase.prototype);

    DataSelectorController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();    

        this.ctor.PagedDataService.get(this.ctor.$jsnbt.db.data.get, {
            domain: this.scope.domain,
            list: this.scope.list
        }).then(function (response) {
            
            deferred.resolve(response);
        }).catch(function (error) {
            deferred.reject(error);
        });
        
        return deferred.promise;
    };

    angular.module("jsnbt")
        .controller('DataSelectorController', ['$scope', '$rootScope', '$data', '$logger', 'PagedDataService', 'CONTROL_EVENTS', 'MODAL_EVENTS', DataSelectorController]);
})();