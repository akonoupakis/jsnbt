;(function () {
    "use strict";

    var FileSelectorController = function ($scope, $rootScope, $logger, CONTROL_EVENTS, MODAL_EVENTS) {
        jsnbt.controllers.ListSelectorModalControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('FileSelectorController');

        $scope.fileGroup = $scope.group ? $scope.group : 'public';

        $scope.selected = $scope.selected || [];

        $scope.path = '/';

        if ($scope.mode === 'single') {
            if ($scope.selected && typeof ($scope.selected) === 'string') {
                var parts = $scope.selected.split('/');
                if (parts.length > 2)
                    $scope.path += _.initial(_.rest(parts, 1), 1).join('/');
            }
        }

        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    FileSelectorController.prototype = Object.create(jsnbt.controllers.ListSelectorModalControllerBase.prototype);

    FileSelectorController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        deferred.resolve({});

        return deferred.promise;
    };

    FileSelectorController.prototype.select = function (selected) {
        return selected;
    };

    FileSelectorController.prototype.getSelected = function () {
        return this.scope.selected;
    };

    FileSelectorController.prototype.setSelected = function (selected) {
        
    };
    
    FileSelectorController.prototype.requested = function () {
        this.scope.$broadcast(this.ctor.CONTROL_EVENTS.valueRequested);

        this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, this.scope.selected);
    };

    FileSelectorController.prototype.selected = function (selected) {
        this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, this.select(selected));
    };

    FileSelectorController.prototype.submitted = function (selected) {
        this.scope.selected = selected;
    };

    angular.module("jsnbt")
        .controller('FileSelectorController', ['$scope', '$rootScope', '$logger', 'CONTROL_EVENTS', 'MODAL_EVENTS', FileSelectorController]);
})();