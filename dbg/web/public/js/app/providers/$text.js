/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$text", function () {

            var getLocalizationObject = function (item, language) {
                var keyParts = item.key.split('.');
                
                var loopObject = {};
                var finalObject = loopObject;
                while (keyParts.length > 0) {
                    var keyPart = keyParts.shift();

                    var objValue = undefined;
                    if (keyParts.length > 0) {
                        objValue = {};
                    }
                    else {
                        objValue = item.value[language];
                    }

                    loopObject[keyPart] = objValue;

                    if (keyParts.length > 0) {
                        loopObject = loopObject[[keyPart]];
                    }                    
                }

                return finalObject;
            };

            return {
                
                $get: function ($q) {

                    return {
                        
                        get: function (language, match) {
                            var deferred = $q.defer();

                            jsnbt.text.get(language, match, function (err, result) {
                                if (err) {
                                    deferred.reject(err);
                                }
                                else {
                                    deferred.resolve(result);
                                }
                            });

                            return deferred.promise;
                        }

                    };

                }

            };
        });
})();