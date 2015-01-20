/* global angular:false */

(function () {
    "use strict";

    angular.module('jsnbt', [])
        .config(function () {

        });

})();

$(document).ready(function () {

    angular.bootstrap(document, ['jsnbt']);

    var randomIndex = 0;
    var getSpyElements = function ($el, level) {
        var results = [];
        if (level <= 2) {
            var spyItems = $('*[data-spy-title!=""][data-spy-level=' + level + ']', $el);

            spyItems.each(function (i, item) {
                randomIndex++;

                var $item = $(item);

                var itemId = 'spiedEl-' + level + '-' + randomIndex;

                $item.prop('id', itemId);
                var spyItem = $('<li />')
                      .append(
                            $('<a />')
                                .prop('href', '#' + itemId)
                                .html($item.data('spy-title'))
                        );

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
        }

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
    }, 100);

});