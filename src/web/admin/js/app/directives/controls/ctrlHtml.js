/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlHtml', function ($timeout, FORM_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngEnabled: '=',
                    ngRequired: '=',
                    ngOptions: '=',
                    ngLabel: '@'
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
                        scope.initiated = false;
                        scope.enabled = true;// scope.ngEnabled !== undefined ? scope.ngEnabled : true;

                        scope.$watch('ngEnabled', function (newValue) {
                            scope.enabled = newValue !== undefined ? newValue : true;
                        });

                        scope.changed = function () {
                            $timeout(function () {
                                scope.$emit(FORM_EVENTS.valueChanged, scope.ngModel);
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

                                if (!valid)
                                    element.addClass('invalid');
                                else
                                    element.removeClass('invalid');
                            }
                            else {
                                element.removeClass('invalid');
                            }

                            return valid;
                        };

                        scope.$on(FORM_EVENTS.initiateValidation, function (sender) {
                            scope.initiated = true;
                            scope.$emit(FORM_EVENTS.valueIsValid, isValid());
                        });

                        scope.isValid = function () {
                            return isValid();
                        };

                    }
                },
                templateUrl: 'tmpl/partial/controls/ctrlHtml.html' 
            };

        });

})();