/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$image", function () {

            return {

                $get: function () {

                    return {

                        build: function (src, gen) {
                            if (!src)
                                return;

                            if (typeof (gen) === 'string') {
                                return src += '?type=' + gen;
                            }
                            else if (typeof (gen) === 'object') {
                                return src += '?type=custom&processors=' + encodeURIComponent(JSON.stringify(gen));
                            }
                            else {
                                return src;
                            }
                        }
                    };

                }

            };
        });
})();