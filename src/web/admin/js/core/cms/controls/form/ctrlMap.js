/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlMap', ['$timeout', 'CONTROL_EVENTS', function ($timeout, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngHeight: '=',
                    ngAddress: '=',
                    ngPostcode: '=',
                    ngCity: '=',
                    ngCountry: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-map');
                    
                    var self = {};

                    scope.id = Math.random().toString().replace('.', '');
                    scope.valid = true;
                    scope.enabled = scope.ngDisabled === undefined || scope.ngDisabled === false;
                    scope.required = scope.ngRequired || false;
                    scope.height = scope.ngHeight || 300;

                    scope.ngCharacters = '-0123456789';

                    scope.coordinates = {
                        longitude: '0',
                        latitude: '0'
                    };
                        
                    self.map = undefined;

                    scope.$watch('ngDisabled', function (newValue) {
                        scope.enabled = newValue === undefined || newValue === false;
                    });

                    scope.$watch('ngRequired', function (newValue) {
                        scope.required = newValue || false;
                    });

                    var initiated = false;

                    scope.changed = function () {
                        $timeout(function () {
                            scope.$emit(CONTROL_EVENTS.valueChanged, scope.ngModel);
                        }, 50);
                    };

                    var isValid = function () {
                        var valid = true;

                        if (scope.enabled) {
                            if (scope.required) {
                                if(scope.coordinates.longitude === '' || scope.coordinates.latitude === '')
                                    valid = false;
                            }
                        }

                        return valid;
                    };
                    
                    scope.$watch('ngModel', function (newValue, prevValue) {
                        if (newValue && _.isArray(newValue) && newValue.length === 2) {
                            if (!_.isEqual(newValue, [parseFloat(scope.coordinates.longitude), parseFloat(scope.coordinates.latitude)])) {
                                scope.coordinates.longitude = newValue[0];
                                scope.coordinates.latitude = newValue[1];
                            }
                        }
                    });

                    scope.$watch('coordinates', function (newValue, prevValue) {
                        
                        if (!_.isEqual([parseFloat(newValue.longitude), parseFloat(newValue.latitude)], scope.ngModel)) {
                            scope.ngModel = [parseFloat(newValue.longitude), parseFloat(newValue.latitude)];
                        }

                        if (self.map) {
                            if (newValue.longitude !== '' && newValue.latitude !== '') {
                                self.map.setMarker({
                                    longitude: parseFloat(newValue.longitude),
                                    latitude: parseFloat(newValue.latitude)
                                });
                            }
                        }

                        if (initiated)
                            scope.valid = isValid();
                    }, true);

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });

                    var chars = '-0123456789'.split('');
                    scope.preventInvalidCharaters = function (event) {
                        var char = String.fromCharCode(event.which);
                        if (chars.indexOf(char) === -1)
                            event.preventDefault();
                    }

                    $timeout(function () {

                        var mapOpts = {
                            el: '#map' + scope.id,
                            zoom: 1,
                            lat: scope.coordinates.latitude,
                            lng: scope.coordinates.longitude
                        };

                        self.map = new GMaps(mapOpts);
                        self.map.markers = [];

                        self.map.setMarker = function (coordinates) {
                            var me = this;

                            $(me.markers).each(function (i, item) {
                                me.removeMarker(item);
                            });

                            var marker = this.addMarker({
                                lat: coordinates.latitude,
                                lng: coordinates.longitude
                            });
                            this.markers.push(marker);

                            this.setCenter(coordinates.latitude, coordinates.longitude);
                        };

                        google.maps.event.addListener(self.map.map, 'click', function (e) {

                            scope.coordinates.longitude = e.latLng.lng().toString();
                            scope.coordinates.latitude = e.latLng.lat().toString();

                            scope.changed();
                        });

                        if (self.map && scope.ngModel && _.isArray(scope.ngModel) && scope.ngModel.length === 2) {
                            var coords = {
                                longitude: scope.ngModel[0],
                                latitude: scope.ngModel[1]
                            };
                            self.map.setMarker(coords);
                            self.map.setZoom(3);
                        }

                    }, 500);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlMap.html'
            };

        }]);
})();