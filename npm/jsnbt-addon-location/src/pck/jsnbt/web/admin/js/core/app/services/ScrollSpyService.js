/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('ScrollSpyService', function ($q) {
            var ScrollSpyService = {};

            ScrollSpyService.get = function (timeout) {
                var deferred = $q.defer();

                setTimeout(function () {
                    var navContents = [];

                    var $spyContainer = $('*[data-scrollspy=""]:first');
                    var spyContents = $spyContainer.find(' *[data-scrollspy]:visible');
                    spyContents.each(function (i, item) {
                        if ($(item).parents('*[data-scrollspy]').length === 1) {
                            var spyName = $(item).data('scrollspy');
                            var spyTarget = $(item).prop('id');
                            if (spyName !== '' && spyTarget !== '') {
                                var navChildContents = [];
                                var spyChildContents = $(item).find('*[data-scrollspy]:visible');
                                spyChildContents.each(function (ii, iitem) {
                                    var spyiName = $(iitem).data('scrollspy');
                                    var spyiTarget = $(iitem).prop('id');
                                    if (spyiName !== '' && spyiTarget !== '') {
                                        navChildContents.push({
                                            name: spyiName,
                                            target: '#' + spyiTarget
                                        });
                                    }
                                });

                                navContents.push({
                                    name: spyName,
                                    target: '#' + spyTarget,
                                    children: navChildContents
                                });
                            }
                        }
                    });

                    deferred.resolve(navContents);
                }, timeout || 0);

                return deferred.promise;
            };

            return ScrollSpyService;
        });
})();