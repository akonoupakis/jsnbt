/* global angular:false */

(function () {
    "use strict";

    angular.scrollspy = false;
    angular.module('jsnbt')
        .directive('ctrlScrollSpy', ['$rootScope', function ($rootScope) {

            var ScrollSpyControl = function (scope, element, attrs) {
                jsnbt.controls.ControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                if (angular.scrollspy) {
                    $('body').scrollspy('refresh');
                }

                var spy = function (cb) {
                    $('body').scrollspy({
                        target: '.bs-sidebar',
                        placement: 'top',
                        offset: 190
                    });

                    angular.scrollspy = true;

                    if (typeof (cb) === 'function') {
                        cb();
                    }
                };

                scope.$watch('ngModel', function (newValue, prevValue) {

                    if (newValue && newValue.length > 0) {
                        var activeId = element.find('li.active').data('target');

                        spy(function () {

                            if (!activeId)
                                activeId = element.find('li:first').data('target');

                            if (activeId) {
                                var matched = element.find('li[data-target="' + activeId + '"]');
                                if (matched.length === 1)
                                    matched.addClass('active');
                                else
                                    element.find('li:first').addClass('active');
                            }

                            element.find('li a').click(function (e) {
                                e.preventDefault();

                                $('body').scrollTo($(this).attr('href'), { offset: -150, duration: 400 });
                            });

                        });
                    }
                });
            };
            ScrollSpyControl.prototype = Object.create(jsnbt.controls.ControlBase.prototype);

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '='
                },
                link: function (scope, element, attrs) {
                    return new ScrollSpyControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/ctrlScrollSpy.html'
            };

        }]);

})();