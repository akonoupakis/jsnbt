/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlImageCropper', function (FORM_EVENTS, ModalService, MODAL_EVENTS) {

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
                  
                    scope.$watch('ngModel', function (newValue) {
                        if (newValue) {
                            var $image = element.find("img");
                            $image.cropper({
                                aspectRatio: 500 / 200,
                                //data: {
                                //    x: 0,
                                //    y: 0
                                //},
                                done: function (data) {
                                    console.log(data);;
                                }
                            });
                        }
                    });
                },
                templateUrl: 'tmpl/core/controls/ctrlImageCropper.html'
            };

        });

})();