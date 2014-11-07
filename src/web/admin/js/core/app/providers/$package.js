/* global angular:false */

(function () {
    "use strict";
    
    angular.module("jsnbt")
        .provider("$package", function () {
            var settings = {};

            return {
                setSettings: function (value) {
                    settings = value;
                },
                $get: function ($q, $http, $cacheFactory) {
                    var Package = {};

                    var cache = $cacheFactory('PackageProviderCache');

                    Package.getConfig = function (name) {
                        var deferred = $q.defer();

                        var cacheKey = 'config:' + name;
                        var cached = cache.get(cacheKey);

                        if (cached) {
                            deferred.resolve(cached);
                        }
                        else {
                            var url = '../jsnbt-pck/' + name;
                            $http.get(url).then(function (data) {
                                if (!!data && !!data.data) {
                                    cache.put(cacheKey, data.data);
                                    deferred.resolve(data.data);
                                } else {
                                    deferred.reject();
                                }
                            });
                        }

                        return deferred.promise;
                    };

                    return Package;
                }
            };
        });
        
})();