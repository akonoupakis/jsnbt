/* global angular:false */

(function () {
    "use strict";
    
    angular.module("jsnbt")
        .provider("Cache", function () {
            var settings = {};

            return {
                setSettings: function (value) {
                    settings = value;
                },
                $get: function ($q, $http) {

                    var Cache = {};

                    Cache.get = function (domain, key) {
                        var deferred = $q.defer();

                        var url = 'jsnbt-cache/' + domain + '/' + key;

                        $http.get(url).then(function (data) {
                            if (!!data && !!data.data && !!data.data.d) {
                                deferred.resolve(data.data.d);
                            } else {
                                deferred.resolve(null);
                            }
                        });

                        return deferred.promise;
                    };

                    Cache.set = function (domain, key, value) {
                        var deferred = $q.defer();

                        var url = 'jsnbt-cache/' + domain + '/' + key + "?value=" + encodeURIComponent(value);

                        $http.post(url).then(function (data) {
                            if (!!data && !!data.data && !!data.data.d) {
                                deferred.resolve(data.data.d);
                            } else {
                                deferred.resolve(null);
                            }
                        });

                        return deferred.promise;
                    };

                    return Cache;
                }
            };
        });
        
})();