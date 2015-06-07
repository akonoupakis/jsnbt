/* global angular:false */

(function () {
    "use strict";

    angular.module('jsnbt', [])
        .directive('dcsContainer', function () {

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    dcsTitle: '@',
                    dcsSpyTitle: '@',
                    dcsSpyLevel: '@'
                },
                template: '<div data-spy-title="{{dcsSpyTitle}}" data-spy-level="{{dcsSpyLevel}}"><h2>{{dcsTitle}}</h2><div ng-transclude></div></div>',
                link: function (scope, element, attrs) {
                    element.addClass('dcs-container');

                    if (!scope.dcsSpyLevel)
                        scope.dcsSpyLevel = 1;
                }
            };
        })
        .directive('dcsIntro', function () {

             return {
                 restrict: 'E',
                 replace: true,
                 transclude: true,
                 scope: {
                 },
                 template: '<div ng-transclude></div>',
                 link: function (scope, element, attrs) {
                     element.addClass('dcs-intro');

                     if (!scope.dcsSpyLevel)
                         scope.dcsSpyLevel = 1;
                 }
             };
        })
         .directive('dcsDefinition', function () {

             return {
                 restrict: 'E',
                 replace: true,
                 transclude: true,
                 scope: {
                 },
                 template: '<div class="panel panel-default"><table class="table table-bordered table-condensed data-structure"><tbody ng-transclude></tbody></table></div>',
                 link: function (scope, element, attrs) {
                     element.addClass('dcs-definition');

                 }
             };
         })
         .directive('dcsDefinitionTitle', function () {

             return {
                 restrict: 'E',
                 replace: true,
                 transclude: true,
                 scope: {
                     type: '@'
                 },
                 template: '<tr class="data-title"><td width="50%" ng-transclude></td><td width="50%">{{type}}</td></tr>',
                 link: function (scope, element, attrs) {
                     element.addClass('dcs-definition-title');

                 }
             };
         })
        .directive('dcsDefinitionDesc', function () {

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                },
                template: '<tr class="data-description"><td colspan="2" ng-transclude></td></tr>',
                link: function (scope, element, attrs) {
                    element.addClass('dcs-definition-desc');

                }
            };
        })
        .directive('dcsDefinitionSample', function () {

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                },
                template: '<tr class="data-sample"><td colspan="2"><span class="code" ng-transclude></span></td></tr>',
                link: function (scope, element, attrs) {
                    element.addClass('dcs-definition-sample');

                }
            };
        })
        .config(function () {

        });

})();

$(document).ready(function () {

    angular.bootstrap(document, ['jsnbt']);

    var randomIndex = 0;
    var getSpyElements = function ($el, level) {
        var results = [];

        var spyItems = $('*[data-spy-title!=""][data-spy-level=' + level + ']', $el);
        spyItems.each(function (i, item) {
            randomIndex++;

            var $item = $(item);

            var itemId = 'spiedEl-' + level + '-' + randomIndex;

            $item.prop('id', itemId);

            var spyAnchor = $('<a />')
                .prop('href', '#' + itemId)
                .html($item.data('spy-title'));

            var spyItem = $('<li />')
                .addClass('level' + level).append(spyAnchor);

            spyAnchor.click(function (e) {
                e.preventDefault();

                $('body').scrollTo('#' + itemId, { offset: -5, duration: 400 });
            });

            var childSpyElements = getSpyElements($item, level + 1);
            if (childSpyElements.length > 0) {
                var childUl = $('<ul />')
                    .addClass('nav');

                $(childSpyElements).each(function (ci, citem) {
                    childUl.append(citem);
                });

                spyItem.append(childUl);
            }

            results.push(spyItem);
        });

        return results;
    }
   
    setTimeout(function () {
        var targetContainer = $('#scroll-spy-container');
        var spyItems = getSpyElements(targetContainer, 1);
        var targetUl = $('ul.nav.bs-docs-sidenav');

        $(spyItems).each(function (i, item) {
            targetUl.append(item);
        });

        $('#scroll-spy-sidebar').affix();
    }, 500);

});