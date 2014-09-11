/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('LanguageService', function ($q, $cacheFactory, Session) {
            var LanguageService = {};

            var cache = $cacheFactory('language');

            LanguageService.getDefault = function () {
                var deferred = $q.defer();

                var language = cache.get('default');
                if (language) {
                    deferred.resolve(language);
                }
                else {
                    dpd.languages.get({ active: true, "default": true }, function (results, error) {
                        if (error) {
                            deferred.reject(error);
                        }
                        else {
                            var lang = _.first(results);
                            cache.put('default', lang.code);
                            deferred.resolve(lang.code);
                        }
                    });
                }

                return deferred.promise;
            };

            LanguageService.getCurrent = function () {
                var deferred = $q.defer();

                var htmlAttr = $('html').attr('lang');
                if (!!htmlAttr) {
                    deferred.resolve(htmlAttr);
                }
                else {
                    Session.getLanguage().then(function (result) {
                        deferred.resolve(result);
                    }, function (error) {
                        deferred.reject(error);
                    });
                }

                return deferred.promise;
            };

            LanguageService.get = function (languageId) {
                var deferred = $q.defer();

                dpd.languages.get(languageId, function (result, error) {
                    if (error) {
                        deferred.reject(error);
                    }
                    else {
                        var lang = result;
                        deferred.resolve(lang.code);
                    }
                });

                return deferred.promise;
            };
            
            return LanguageService;
        });
})();