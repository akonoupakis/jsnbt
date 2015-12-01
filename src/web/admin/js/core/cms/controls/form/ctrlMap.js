/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlMap', ['$rootScope', '$timeout', '$q', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, CONTROL_EVENTS) {

            var MapControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-map');
                
                scope.id = Math.random().toString().replace('.', '');
                scope.valid = true;
                
                scope.height = scope.ngHeight || 300;
                
                scope.coordinates = {
                    longitude: '0',
                    latitude: '0'
                };

                self.map = undefined;

                scope.$watch('ngModel', function (newValue, prevValue) {
                    if (newValue && _.isArray(newValue) && newValue.length === 2) {
                        if (!_.isEqual(newValue, [parseFloat(scope.coordinates.longitude), parseFloat(scope.coordinates.latitude)])) {
                            scope.coordinates.longitude = newValue[0];
                            scope.coordinates.latitude = newValue[1];
                        }
                    }
                });

                scope.$watch('ngDisabled', function (newValue) {
                    if (self.map) {
                        var disabled = newValue === true;

                        self.map.setOptions({
                            draggable: !disabled,
                            zoomControl: !disabled
                        });
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

                    self.validate();
                }, true);
                
                var chars = '-0123456789'.split('');
                scope.preventInvalidCharaters = function (event) {
                    var char = String.fromCharCode(event.which);
                    if (chars.indexOf(char) === -1)
                        event.preventDefault();
                }

                $timeout(function () {

                    var disabled = scope.ngDisabled === true;

                    var mapOpts = {
                        el: '#map' + scope.id,
                        zoom: 3,
                        lat: 0,
                        lng: 0,

                        draggable: !disabled,
                        zoomControl: !disabled,

                        mapTypeControl: false,
                        scaleControl: false,
                        streetViewControl: false,
                        rotateControl: false
                    };

                    self.map = new GMaps(mapOpts);
                    self.map.markers = [];

                    self.map.setMarker = function (coordinates) {
                        var me = this;

                        $(me.markers).each(function (i, item) {
                            me.removeMarker(item);
                        });

                        if (!isNaN(coordinates.longitude) && !isNaN(coordinates.latitude)) {
                            var marker = this.addMarker({
                                lat: coordinates.latitude,
                                lng: coordinates.longitude
                            });
                            this.markers.push(marker);
                            this.setCenter(coordinates.latitude, coordinates.longitude);
                        }
                    };

                    google.maps.event.addListener(self.map.map, 'click', function (e) {

                        if (!self.isEnabled())
                            return;

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

                    self.init();

                }, 500);
            };
            MapControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            MapControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {
                        if (self.scope.ngRequired) {
                            if (self.scope.coordinates.longitude === '' || self.scope.coordinates.latitude === '')
                                valid = false;
                        }
                    }

                    deferred.resolve(valid);
                });

                return deferred.promise;
            };

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngHeight: '='
                }),
                link: function (scope, element, attrs) {
                    return new MapControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlMap.html'
            };

        }]);
})();