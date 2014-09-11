/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('SettingService', function ($q) {
            var SettingService = {};

            SettingService.get = function (key) {
                var deferred = $q.defer();

                dpd.settings.get({ key: key }, function (result, err) {
                    if (err) {
                        deferred.reject(err);
                    }
                    else {
                        var setting = _.first(result);
                        if (setting) {
                            deferred.resolve(setting.value);
                        } else {
                            deferred.reject(new Error('not found'));
                        }
                    }
                });

                return deferred.promise; 
            }; 

            return SettingService;
        });
})();