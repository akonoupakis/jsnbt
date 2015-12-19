/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('LocationService', ['$location', function ($location) {
            var LocationService = {};
            
            LocationService.getBreadcrumb = function () {
                var paths = _.string.trim($location.$$path, '/').split('/');
                var breadcrumbs = [];
                var urlPart = '';

                $(paths).each(function (i, item) {
                    if (item !== '') {
                        urlPart += '/' + item;
                        breadcrumbs.push({
                            name: item,
                            url: urlPart,
                            active: i === (paths.length - 1)
                        });
                    }
                });

                return breadcrumbs;
            };

            return LocationService;
        }]);
})();