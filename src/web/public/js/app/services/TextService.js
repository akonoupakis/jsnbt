/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('TextService', function ($q, LanguageService) {
            var TextService = {};

            TextService.get = function (key) {
                var deferred = $q.defer();

                LanguageService.getCurrent().then(function (language) {
                    dpd.texts.get({ key: key, language: language }, function (result, err) {
                        if (err) {
                            deferred.reject(err);
                        }
                        else {
                            var text = _.first(result);
                            if (text) {
                                deferred.resolve(text.value);
                            } else {
                                deferred.reject(new Error('not found'));
                            }
                        }
                    });
                },
                function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            return TextService;
        });
})();