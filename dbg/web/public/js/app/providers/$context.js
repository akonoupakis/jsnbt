/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$context", function () {
            
            return {
                
                $get: function () {

                    var ctx = {

                        language: $('html').prop('lang'),

                        layout: $('head > meta[name="layout"]').prop('content'),

                        pageId: $('head > meta[name="page"]').prop('content'),

                        pointerId: $('head > meta[name="pointer"]').prop('content')

                    };

                    return ctx;

                }

            };
        });
})();