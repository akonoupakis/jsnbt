/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('NodeService', function ($q, $http, LanguageService) {
            var NodeService = {};
            
            var getCurrentUrl = function () {

                var currentUrl = document.location.pathname;
                if (!_.str.endsWith(currentUrl, '/'))
                    currentUrl += '/';

                if (document.location.search !== '')
                    currentUrl += document.location.search;

                return currentUrl;
            };

            NodeService.getCurrent = function () {

                var deferred = $q.defer();

                var currentUrl = getCurrentUrl();
                var url = 'jsnbt-service/node/?fn=getByUrl&url=' + encodeURIComponent(currentUrl);
                
                $http.get(url).then(function (data) {
                    if (!!data && !!data.data && !!data.data.d) {
                        deferred.resolve(data.data.d);
                    } else {
                        deferred.resolve(null);
                    }
                });

                return deferred.promise;
            };

            NodeService.getById = function (id, language) {
                var deferred = $q.defer();

                var url = 'jsnbt-service/node/?fn=getById&id=' + id;
                if (language)
                    url += '&language=' + language;

                $http.get(url).then(function (data) {
                    if (!!data && !!data.data && !!data.data.d) {
                        deferred.resolve(data.data.d);
                    } else {
                        deferred.resolve(null);
                    }
                });

                return deferred.promise;
            };
            
            NodeService.getByCode = function (domain, code, language) {
                var deferred = $q.defer();

                var url = 'jsnbt-service/node/?fn=getByCode&domain=' + domain + '&code=' + code;
                if (language)
                    url += '&language=' + language;

                $http.get(url).then(function (data) {
                    if (!!data && !!data.data && !!data.data.d) {
                        deferred.resolve(data.data.d);
                    } else {
                        deferred.resolve(null);
                    }
                });

                return deferred.promise;
            };
            
            NodeService.getByParent = function (parentId, language) {
                var deferred = $q.defer();

                var url = 'jsnbt-service/node/?fn=getByParent&parentId=' + parentId + '&language=' + language;

                $http.get(url).then(function (data) {
                    if (!!data && !!data.data && !!data.data.d) {
                        deferred.resolve(data.data.d);
                    } else {
                        deferred.resolve(null);
                    }
                });

                return deferred.promise;
            };

            NodeService.getByParents = function (parentIds, language) {
                var deferred = $q.defer();

                var url = 'jsnbt-service/node/?fn=getByParents&parentIds=' + parentIds + '&language=' + language;

                $http.get(url).then(function (data) {
                    if (!!data && !!data.data && !!data.data.d) {
                        deferred.resolve(data.data.d);
                    } else {
                        deferred.resolve(null);
                    }
                });

                return deferred.promise;
            };

            return NodeService;
        });
})();