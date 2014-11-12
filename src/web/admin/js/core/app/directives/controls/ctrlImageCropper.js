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
                                    if (cropGen && cropGen.options && cropGen.options.x && cropGen.options.y) {

                                        var imageProperWidth = $image.get(0).naturalWidth;
                                        var imageProperHeight = $image.get(0).naturalHeight;

                                        var previewImage = element.find('.cropper-container img');

                                        var imagePreviewWidth = previewImage.get(0).width;
                                        var imagePreviewHeight = previewImage.get(0).height;

                                        var cropX1 = parseInt((imagePreviewWidth / imageProperWidth) * cropGen.options.x);
                                        var cropX2 = parseInt((imagePreviewWidth / imageProperWidth) * (cropGen.options.x + cropGen.options.width));
                                        var cropWidth = cropX2 - cropX1;

                                        var cropY1 = parseInt((imagePreviewHeight / imageProperHeight) * cropGen.options.y);
                                        var cropY2 = parseInt((imagePreviewHeight / imageProperHeight) * (cropGen.options.y + cropGen.options.height));
                                        var cropHeight = cropY2 - cropY1;

                                        $image.cropper('setData', {
                                            x: cropX1,
                                            y: cropY1,
                                            width: cropWidth,
                                            height: cropHeight
                                        });
                                    }

                                    $image.cropper('reset');
                                },
                                done: function (data) {

                                    var imageProperWidth = $image.get(0).naturalWidth;
                                    var imageProperHeight = $image.get(0).naturalHeight;
                                    
                                    var previewImage = element.find('.cropper-container img');

                                    var imagePreviewWidth = previewImage.get(0).width;
                                    var imagePreviewHeight = previewImage.get(0).height;

                                    var cropX1 = parseInt((imageProperWidth / imagePreviewWidth) * data.x);
                                    var cropX2 = parseInt((imageProperWidth / imagePreviewWidth) * (data.width + data.x));
                                    var cropWidth = cropX2 - cropX1;

                                    var cropY1 = parseInt((imageProperHeight / imagePreviewHeight) * data.y);
                                    var cropY2 = parseInt((imageProperHeight / imagePreviewHeight) * (data.height + data.y));
                                    var cropHeight = cropY2 - cropY1;

                                    scope.ngModel.gen = [{
                                        type: 'crop',
                                        options: {
                                            x: cropX1,
                                            y: cropY1,
                                            width: cropWidth,
                                            height: cropHeight
                                        }
                                    }, {
                                        type: 'resize',
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