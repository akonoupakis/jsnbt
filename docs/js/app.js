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
                    title: '@',
                    titleLevel: '@',
                    spyTitle: '@',
                    spyLevel: '@'
                },
                template: '<div><span ng-show="title" class="h{{titleLevel}}">{{title}}</span><div ng-transclude></div></div>',
                link: function (scope, element, attrs) {
                    element.addClass('dcs-container');

                    if (!scope.spyLevel)
                        scope.spyLevel = 1;

                    if (!scope.titleLevel)
                        scope.titleLevel = 1;

                    element.attr('data-spy-title', scope.spyTitle);
                    element.attr('data-spy-level', scope.spyLevel);
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
                 template: '<p ng-transclude></p>',
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
                 template: '<div class="panel panel-default"><table class="table table-bordered table-condensed"><tbody ng-transclude></tbody></table></div>',
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
                 template: '<tr><td width="50%" ng-transclude></td><td ng-show="type" width="50%">{{type}}</td></tr>',
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
                template: '<tr><td colspan="2" ng-transclude></td></tr>',
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
                template: '<tr><td colspan="2"><pre class="code" ng-transclude></pre></td></tr>',
                link: function (scope, element, attrs) {
                    element.addClass('dcs-definition-sample');
                    element.html(element.html());
                    //console.log('link', element.html(), ':');
                    //console.log(1, element, attrs);

                }//,
                //compile: function (tElem, tAttrs) {
                //    console.log(name + ': compile');
                //    return {
                //        pre: function (scope, iElem, iAttrs) {
                //            console.log('pre', iElem, iAttrs, iElem.html(), ': pre link');
                //        },
                //        post: function (scope, iElem, iAttrs) {
                //            console.log('post', iElem, iAttrs, iElem.html(), ': post link');
                //        }
                //    }
                //}
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