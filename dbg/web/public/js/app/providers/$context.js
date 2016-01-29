/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$context", function () {
            
            return {
                
                $get: function () {

                    var ctx = {

                        language: $('html').prop('lang'),

                        layouts: $('head > meta[name="layouts"]').prop('content').split(','),

                        pageId: $('head > meta[name="page"]').prop('content'),

                        pointerId: $('head > meta[name="pointer"]').prop('content'),

                        hierarchy: $('head > meta[name="hierarchy"]').prop('content').split(',')

                    };

                    return ctx;

                }

            };
        });
})();