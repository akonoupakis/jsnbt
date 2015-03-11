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
                    
                    scope.ctrl = 'ctrlImageCropper';

                    scope.id = Math.random().toString().replace('.', '');

                    scope.$watch('ngModel.src', function (newValue) {
                        if (newValue) {
                            var $image = element.find("img");

                            var cropGen = _.first(scope.ngModel.gen || []);

                            if (element.find('.cropper-container').length > 0)
                                $image.cropper('destroy');

                            $image.cropper({
                                aspectRatio: scope.ngWidth / scope.ngHeight,
                                rotatable: false,                         
                                built: function () {
                                    if (cropGen && cropGen.options) {
                                        $image.cropper('setData', {
                                            x: cropGen.options.x,
                                            y: cropGen.options.y,
                                            width: cropGen.options.width,
                                            height: cropGen.options.height
                                        });
                                    }
                                }, 
                                done: function (data) {
                                    scope.ngModel.gen = [{
                                        type: 'crop',
                                        options: {
                                            x: data.x,
                                            y: data.y,
                                            width: data.width,
                                            height: data.height
                                        }
                                    }, {
                                        type: 'fit',
                                        options: {
                                            width: scope.ngWidth,
                                            height: scope.ngHeight
                                        }
                                    }];
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