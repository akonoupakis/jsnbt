;(function () {
    "use strict";

    var ContainerSelectorController = function ($scope, $rootScope, $jsnbt, $logger, CONTROL_EVENTS, MODAL_EVENTS) {
        jsnbt.controllers.ListSelectorModalControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('ContainerSelectorController');

        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    ContainerSelectorController.prototype = Object.create(jsnbt.controllers.ListSelectorModalControllerBase.prototype);

    ContainerSelectorController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();
        
        var data = {
            items: []
        };

        for (var containerName in this.ctor.$jsnbt.containers) {
            var container = this.ctor.$jsnbt.containers[containerName];

            var containerItem = {
                id: container.id,
                name: container.name,
                html: container.html,
                $parent: data
            };

            data.items.push(containerItem);
        };

        deferred.resolve(data);

        return deferred.promise;
    };

    angular.module("jsnbt")
        .controller('ContainerSelectorController', ['$scope', '$rootScope', '$jsnbt', '$logger', 'CONTROL_EVENTS', 'MODAL_EVENTS', ContainerSelectorController]);
})();