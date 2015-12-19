; (function () {
    "use strict";

    angular.module("jsnbt")
        .directive('ctrlMap', function ($timeout) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '='
                },
                link: function (scope, element, attrs) {

                    var self = {};

                    scope.id = Math.random().toString().replace('.', '');
                    
                    self.map = undefined;

                    
                    scope.$watch('ngModel', function (newValue, prevValue) {
                        if (newValue && newValue.lat && newValue.lng) {
                            if (self.map) {
                                self.map.addMarker(newValue);
                                self.map.setZoom(15);
                            }
                        }
                    });

                    $timeout(function () {

                        var mapOpts = {
                            el: '#map' + scope.id,
                            zoom: 1,
                            lat: 0,
                            lng: 0
                        };

                        self.map = new GMaps(mapOpts);
                     
                        if (scope.ngModel && scope.ngModel.lat && scope.ngModel.lng) {
                            if (self.map) {
                                self.map.setCenter(scope.ngModel.lat, scope.ngModel.lng);
                                self.map.addMarker(scope.ngModel);
                                self.map.setZoom(15);
                            }
                        }

                    }, 500);

                },
                templateUrl: 'tmpl/core/controls/ctrlMap.html'
            };

        });
})();