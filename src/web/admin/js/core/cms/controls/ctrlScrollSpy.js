/* global angular:false */

(function () {
    "use strict";

    angular.scrollspy = false;
    angular.module('jsnbt')
        .directive('ctrlScrollSpy', ['$rootScope', function ($rootScope) {

            var ScrollSpyControl = function (scope, element, attrs) {
                jsnbt.controls.ControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

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

                    if (newValue && newValue.length > 0 && !_.isEqual(newValue, prevValue)) {
                        var activeId = element.find('li.active').data('target');

                        setTimeout(function () {
                            if (angular.scrollspy) {
                                $('body').scrollspy('refresh');
                            }
                            $('body').scrollTo(0, { offset: 0, duration: 0 });
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
                        }, 200);
                    }
                });
            };
            ScrollSpyControl.prototype = Object.create(jsnbt.controls.ControlBase.prototype);

            ScrollSpyControl.prototype.destroy = function () {
                jsnbt.controls.ControlBase.prototype.destroy.apply(this, arguments);
            };

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.ControlBase.prototype.properties, {
                    ngModel: '='
                }),
                link: function (scope, element, attrs) {
                    return new ScrollSpyControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/ctrlScrollSpy.html'
            };

        }]);

})();