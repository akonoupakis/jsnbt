/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlHtml', ['$timeout', 'CONTROL_EVENTS', function ($timeout, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngOptions: '=',
                    ngLabel: '@',
                    ngTip: '@'
                },
                compile: function (elem, attributes, transclude) {

                    var defaults = {
                        resize: false,
                        height: '250px',
                        menubar: false,
                        statusbar: false
                    };

                    var options = {};
                    
                    var getJson = function ($string) {
                        var jsonResult = jsonlite.parse($string);

                        for (var item in jsonResult) {
                            if (_.str.startsWith(jsonResult[item], "'") && _.str.endsWith(jsonResult[item], "'"))
                            {
                                var loopValue = jsonResult[item];
                                var resultvalue = _.str.rtrim(_.str.ltrim(loopValue, "'"), "'");
                                jsonResult[item] = resultvalue;
                            }
                        }

                        return jsonResult;
                    };

                    $.extend(true, options, defaults);
                    if (attributes.ngOptions) {
                        $.extend(true, options, getJson(attributes.ngOptions));
                    }

                    elem.find('textarea[ui-tinymce]').attr('ui-tinymce', JSON.stringify(options));

                    return function (scope, element, attrs) {
                        element.addClass('ctrl');
                        element.addClass('ctrl-html');

                        scope.id = Math.random().toString().replace('.', '');
                        scope.valid = true;
                        scope.enabled = true;

                        scope.$watch('ngDisabled', function (newValue) {
                            scope.enabled = true; // newValue !== undefined ? newValue : true;
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

                                if (valid) {
                                    if (scope.ngRequired) {
                                        valid = !!scope.ngModel && scope.ngModel !== '';
                                    }
                                }

                            }

                            return valid;
                        };

                        scope.$watch('ngModel', function () {
                            if (initiated)
                                scope.valid = isValid();
                        });

                        scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                            initiated = true;
                            scope.valid = isValid();
                            scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                        });
                        
                    }
                },
                templateUrl: 'tmpl/core/controls/ctrlHtml.html'
            };

        }]);

})();