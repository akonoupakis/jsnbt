;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ImageSelectorController', function ($scope, MODAL_EVENTS) {

            $scope.mode = 'single';

            $scope.ngModel = $scope.selected;
            
            $scope.$on(MODAL_EVENTS.valueSelected, function (sender, selected) {
                sender.stopPropagation();
               
                console.log(11, selected);
                //$scope.$emit(MODAL_EVENTS.valueSubmitted, selected);
            });

            $scope.$on(MODAL_EVENTS.valueSubmitted, function (sender, selected) {
                sender.stopPropagation();

                console.log(12, selected);

                // go to cropper,
                // accept by what? submitted?

                // the below becomes an endless loop, do not uncomment
                //$scope.$emit(MODAL_EVENTS.valueSubmitted, selected);                
            });

        });
})();