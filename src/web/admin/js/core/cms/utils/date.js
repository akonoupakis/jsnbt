/* global angular:false */
(function () {

    "use strict";
    
    angular.module('jsnbt')
        .filter("date", function () {
            return function (input, format) {
                var date = new Date(input);
                return moment(date).format(format);
            };
        })
    .filter("gravatar", function () {
        return function (input) {
            var md5 = new Hashes.MD5();
            return md5.hex((input || '').toLowerCase());
        };
    });

})();