/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("Session", function () {
            var settings = {};

            return {
                setSettings: function (value) {
                    settings = value;
                },
                $get: function ($q, $http) {

                    var Session = {};

                    Session.getLanguage = function () {
                        var deferred = $q.defer();

                        var url = 'jsnbt-session/language';

                        $http.get(url).then(function (data) {
                            if (!!data && !!data.data && !!data.data.d) {
                                deferred.resolve(data.data.d);
                            } else {
                                deferred.resolve(null);
                            }
                        });

                        return deferred.promise;
                    };

                    return Session;
                }
            };
        });
})();