/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        // the $url is used to build up a url for a given node
        // urls coming on the node objects from dpd do not always hold the full url, especially when pointed through a pointer node
        // the $url helps combining the urls of the two to form a full valid url for a node, for a given language
        .provider("$url", function () {
            
            return {

                $get: function () {

                    return {

                        build: function (language, page, pointer) {

                            return jsnbt.url.build(language, page, pointer);

                        }

                    };

                }

            };
        });
})();