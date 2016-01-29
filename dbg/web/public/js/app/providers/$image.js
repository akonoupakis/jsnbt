/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$image", function () {

            return {

                $get: function () {

                    return {

                        build: function (src, gen) {

                            return jsnbt.image.build(src, gen);

                        }

                    };

                }

            };
        });
})();