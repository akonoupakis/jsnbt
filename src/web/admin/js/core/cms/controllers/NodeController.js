/* global angular:false */

(function () {
    "use strict";

    var NodeController = function ($scope, $rootScope, $logger, $q) {
        jsnbt.controllers.NodeFormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('NodeController');
      
        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    NodeController.prototype = Object.create(jsnbt.controllers.NodeFormControllerBase.prototype);

    NodeController.prototype.getBreadcrumb = function () {
        var deferred = this.ctor.$q.defer();

        var self = this;

        jsnbt.controllers.NodeFormControllerBase.prototype.getBreadcrumb.apply(this, arguments).then(function (breadcrumb) {

            self.scope.getNodeBreadcrumb(self.isNew() ? { id: 'new', parent: self.scope.parent ? self.scope.parent.id : '' } : self.scope.node, self.scope.prefix).then(function (bc) {

                breadcrumb.splice(self.scope.offset);

                _.each(bc, function (c) {
                    breadcrumb.push(c);
                });

                deferred.resolve(breadcrumb);

            }, function (ex) {
                deferred.reject(ex);
            }); 

            deferred.resolve(breadcrumb);

        }).catch(function (ex) {
            deferred.reject(ex);
        });

        return deferred.promise;
    };

    angular.module("jsnbt")
        .controller('NodeController', ['$scope', '$rootScope', '$logger', '$q', NodeController]);
})();