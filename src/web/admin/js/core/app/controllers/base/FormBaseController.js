/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('FormBaseController', function ($scope, $routeParams, LocationService, ScrollSpyService, CONTROL_EVENTS) {
           
            $scope.id = $routeParams.id;
            $scope.new = $scope.id === 'new';
            $scope.name = undefined;
            $scope.item = undefined;
                      
            $scope.valid = true;

            $scope.published = true;
            $scope.draft = false;

            $scope.isNew = function () {
                return $scope.new;
            };

            $scope.set = function (data) {
                $scope.item = data;
            };

            $scope.get = function () {
                return $scope.item;
            };

            $scope.setName = function (name) {
                $scope.name = name;
            };

            $scope.setLocation = function () {
                var breadcrumb = LocationService.getBreadcrumb();
                breadcrumb = breadcrumb.slice(0, breadcrumb.length - 1);
                if ($scope.new) {
                    breadcrumb.push({
                        name: 'new',
                        active: true
                    });
                }
                else {
                    breadcrumb.push({
                        name: $scope.name,
                        active: true
                    });
                }

                $scope.current.setBreadcrumb(breadcrumb);
            };

            $scope.setSpy = function (time) {
                ScrollSpyService.get(time || 0).then(function (response) {
                    $scope.nav = response;
                });
            };

            $scope.setValid = function (value) {
                $scope.valid = value;
            };

            $scope.isValid = function () {
                return $scope.valid;
            };

            $scope.setPublished = function (value) {
                $scope.published = value;
                $scope.draft = !value;
            };
            
            $scope.validate = function () {
                $scope.setValid(true);
                $scope.$broadcast(CONTROL_EVENTS.initiateValidation);
            };

            $scope.back = function () {
                throw new Error('not implemeted: back()');
            };

            $scope.discard = function () {
                throw new Error('not implemeted: discard()');
            };

            $scope.publish = function () {
                throw new Error('not implemeted: publish()');
            };
            
            $scope.$watch('name', function (newValue, prevValue) {
                $scope.setLocation();
            });

            $scope.$on(CONTROL_EVENTS.valueChanged, function (sender) {
                sender.stopPropagation();

                $scope.published = false;
            });

            $scope.$on(CONTROL_EVENTS.valueIsValid, function (sender, value) {
                sender.stopPropagation();

                if (!value)
                    $scope.valid = false;
            });
        });
})();