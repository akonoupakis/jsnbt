/* global angular:false */

(function () {
    "use strict";

    var LayoutController = function ($scope, $rootScope, $timeout, $q, $logger, $data, $jsnbt) {
        jsnbt.controllers.FormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('LayoutController');

        $scope.layoutId = undefined;
        $scope.model = {};
        
        $scope.tmpl = null;
        
        this.enqueue('loaded', '', function () {
            var deferred = $q.defer();

            var layout = $jsnbt.layouts[$scope.id];
            if (layout)
                $scope.tmpl = layout.form;
            else
                $scope.tmpl = null;

            deferred.resolve();

            return deferred.promise;
        });
        
        this.enqueue('published', '', function (data) {
            var deferred = $q.defer();

            if (!$scope.layoutId) {
                $scope.layoutId = data.id;
                $scope.model.id = data.id;
            }

            deferred.resolve();

            return deferred.promise;
        });
                
        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    LayoutController.prototype = Object.create(jsnbt.controllers.FormControllerBase.prototype);

    LayoutController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        var self = this;

        this.ctor.$data.layouts.get({
            layout: this.scope.id,
            $single: true
        }).then(function (result) {
            self.setTemplate(self.scope.id);
            deferred.resolve(result);
        }).catch(function (error) {
            if (error[404]) {
                self.setTemplate(self.scope.id);
                deferred.resolve();
            } else {
                deferred.reject(error);
            }
        });

        return deferred.promise;
    };

    LayoutController.prototype.set = function (data) {
        var deferred = this.ctor.$q.defer();

        if (this.ctor.$jsnbt.layouts[this.scope.id])
            this.setTitle(this.ctor.$jsnbt.layouts[this.scope.id].name);
        else
            this.setTitle(this.scope.id);

        if (data) {
            this.scope.layoutId = data.id;
            this.scope.model = data;
        }
        else {
            this.scope.layoutId = undefined;
            this.scope.model = this.ctor.$data.create('layouts', {
                layout: this.scope.id
            });
        }

        this.scope.language = this.scope.application.localization.enabled ? (this.scope.defaults.language ? this.scope.defaults.language : _.first(this.scope.application.languages).code) : this.scope.defaults.language;

        this.setValid(true);
        this.setPublished(true);

        deferred.resolve(this.scope.model);

        return deferred.promise;
    };

    LayoutController.prototype.setTemplate = function (name) {
        var layout = this.ctor.$jsnbt.layouts[this.scope.id];
        if (layout)
            this.scope.tmpl = layout.form;
        else
            this.scope.tmpl = null;
    }

    LayoutController.prototype.get = function () {
        return this.scope.model;
    };

    LayoutController.prototype.push = function (data) {
        var deferred = this.ctor.$q.defer();

        if (this.scope.layoutId) {
            this.ctor.$data.layouts.put(this.scope.layoutId, {
                content: data.content || {}
            }).then(function (result) {
                deferred.resolve(result);
            }).catch(function (error) {
                deferred.reject(error);
            });
        }
        else {
            this.ctor.$data.layouts.post(data).then(function (result) {
                deferred.resolve(result);
            }).catch(function (error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;
    };

    angular.module("jsnbt")
        .controller('LayoutController', ['$scope', '$rootScope', '$timeout', '$q', '$logger', '$data', '$jsnbt', LayoutController]);
})();