/* global angular:false */

(function () {
    "use strict";

    var LayoutController = function ($scope, $timeout, $q, $logger, $data, $jsnbt) {
        jsnbt.controllers.FormControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('LayoutController');

        $scope.layoutId = undefined;
        $scope.layout = {};
        
        $scope.tmpl = null;
        
        $scope.setTemplate = function (name) {
            var layout = $jsnbt.layouts[$scope.id];
            if (layout)
                $scope.tmpl = layout.form;
            else
                $scope.tmpl = null;
        }
        
        $scope.load = function () {
            var deferred = $q.defer();

            $data.layouts.get({
                layout: $scope.id
            }).then(function (results) {

                $scope.setTemplate($scope.id);

                deferred.resolve(_.first(results));
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        $scope.enqueue('loaded', function () {
            var deferred = $q.defer();

            var layout = $jsnbt.layouts[$scope.id];
            if (layout)
                $scope.tmpl = layout.form;
            else
                $scope.tmpl = null;

            deferred.resolve();

            return deferred.promise;
        });

        $scope.set = function (data) {
            var deferred = $q.defer();

            if ($jsnbt.layouts[$scope.id])
                $scope.setTitle($jsnbt.layouts[$scope.id].name);
            else
                $scope.setTitle($scope.id);

            if (data) {
                $scope.layoutId = data.id;
                $scope.layout = data;
            }
            else {
                $scope.layoutId = undefined;
                $scope.layout =  $data.create('layouts', {
                    layout: $scope.id
                });
            }

            $scope.language = $scope.application.localization.enabled ? ($scope.defaults.language ? $scope.defaults.language : _.first($scope.application.languages).code) : $scope.defaults.language;
            
            $scope.setValid(true);
            $scope.setPublished(true);

            deferred.resolve($scope.layout);

            return deferred.promise;
        };

        $scope.get = function () {
            return $scope.layout;
        };
        
        $scope.push = function (data) {
            var deferred = $q.defer();
            
            if ($scope.layoutId) {
                $data.layouts.put($scope.layoutId, {
                    content: data.content || {}
                }).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (error) {
                    deferred.reject(error);
                });
            }
            else {
                $data.layouts.post(data).then(function (result) {
                
                    deferred.resolve(result);
                }).catch(function (error) {
                    deferred.reject(error);
                });
            }

            return deferred.promise;
        };

        $scope.enqueue('published', function (data) {
            var deferred = $q.defer();

            if (!$scope.layoutId) {
                $scope.layoutId = data.id;
                $scope.layout.id = data.id;
            }

            deferred.resolve();

            return deferred.promise;
        });
                
        $scope.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    LayoutController.prototype = Object.create(jsnbt.controllers.FormControllerBase.prototype);

    angular.module("jsnbt")
        .controller('LayoutController', ['$scope', '$timeout', '$q', '$logger', '$data', '$jsnbt', LayoutController]);
})();