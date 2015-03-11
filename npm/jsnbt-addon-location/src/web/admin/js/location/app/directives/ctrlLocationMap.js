;(function () {
    "use strict";

    angular.module("jsnbt-addon-location")
        .directive('ctrlLocationMap', function ($timeout, CONTROL_EVENTS) {

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
                    element.addClass('ctrl-location-map');
                    
                    var self = {};

                    scope.id = Math.random().toString().replace('.', '');
                    scope.valid = true;
                    scope.enabled = scope.ngDisabled === undefined || scope.ngDisabled === false;
                    scope.required = scope.ngRequired || false;
                    scope.height = scope.ngHeight || 250;
                    
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
                                if (scope.ngModel === undefined)
                                    valid = false;
                                else if (!scope.ngModel.lat || !scope.ngModel.lng)
                                    valid = false;
                            }
                        }

                        return valid;
                    };
                    
                    scope.$watch('ngModel', function (newValue, prevValue) {
                        if (newValue && newValue.lat && newValue.lng) {
                            if (self.map) {
                                self.map.setMarker(newValue);
                                self.map.setZoom(15);
                            }
                        }

                        if (initiated)
                            scope.valid = isValid();
                    });

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });


                    $timeout(function () {

                        var mapOpts = {
                            el: '#map' + scope.id,
                            zoom: 1,
                            lat: 0,
                            lng: 0
                        };

                        self.map = new GMaps(mapOpts);
                        self.map.markers = [];

                        self.map.setMarker = function (coordinates) {
                            var me = this;

                            $(me.markers).each(function (i, item) {
                                me.removeMarker(item);
                            });

                            var marker = this.addMarker(coordinates);
                            this.markers.push(marker);

                            this.setCenter(coordinates.lat, coordinates.lng);
                        };
                      
                        google.maps.event.addListener(self.map.map, 'click', function (e) {
                            self.map.setMarker({
                                lat: e.latLng.lat(),
                                lng: e.latLng.lng()
                            });

                            if (scope.ngModel === undefined)
                                scope.ngModel = {};

                            scope.ngModel.lat = e.latLng.lat();
                            scope.ngModel.lng = e.latLng.lng();
                            scope.changed();
                        });
                        
                        self.map.addControl({
                            position: 'top_right',
                            content: 'Locate & mark',
                            style: {
                                margin: '5px',
                                padding: '1px 6px',
                                border: 'solid 1px #717B87',
                                background: '#fff'
                            },
                            events: {
                                click: function () {

                                    var addressLine = '';
                                    if (scope.ngAddress)
                                        addressLine += scope.ngAddress;

                                    if (scope.ngPostcode)
                                        addressLine += ' ' + scope.ngPostcode;

                                    if (scope.ngCity)
                                        addressLine += ' ' + scope.ngCity;

                                    if (scope.ngCountry)
                                        addressLine += ' ' + scope.ngCountry;

                                    if (addressLine.trim() !== '') {
                                        GMaps.geocode({
                                            address: addressLine,
                                            callback: function (results, status) {
                                                if (status == 'OK') {
                                                    var latlng = results[0].geometry.location;
                                                    self.map.setCenter(latlng.lat(), latlng.lng());
                                                    self.map.setMarker({
                                                        lat: latlng.lat(),
                                                        lng: latlng.lng()
                                                    });
                                                    
                                                    self.map.setZoom(15);

                                                    if (scope.ngModel === undefined)
                                                        scope.ngModel = {};

                                                    scope.ngModel.lat = latlng.lat();
                                                    scope.ngModel.lng = latlng.lng();
                                                    scope.changed();
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        });
                     
                        if (scope.ngModel && scope.ngModel.lat && scope.ngModel.lng) {
                            if (self.map) {
                                self.map.setMarker(scope.ngModel);
                                self.map.setZoom(15);
                            }
                        }

                    }, 500);

                },
                templateUrl: 'tmpl/location/controls/ctrlLocationMap.html'
            };

        });
})();