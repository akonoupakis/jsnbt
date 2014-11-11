/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlImageCropper', function (CONTROL_EVENTS, ModalService) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngHeight: '=',
                    ngWidth: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-image-cropper');

                    scope.id = Math.random().toString().replace('.', '');

                    scope.$watch('ngModel.src', function (newValue) {
                        if (newValue) {
                            console.log('nnn', newValue);
                            var $image = element.find("img");
                            $image.cropper({
                                aspectRatio: 500 / 200,
                                //data: {
                                //    x: 0,
                                //    y: 0
                                //},
                                done: function (data) {
                                    scope.ngModel.gen = {
                                        x: data.x,
                                        y: data.y,
                                        width: data.width,
                                        height: data.height
                                    };
                                }
                            });
                        }
                    });

                    scope.$on(CONTROL_EVENTS.valueRequested, function (sender) {
                        scope.$emit(CONTROL_EVENTS.valueSubmitted, scope.ngModel.gen);
                    });
                },
                templateUrl: 'tmpl/core/controls/ctrlImageCropper.html'
            };

        });

})();