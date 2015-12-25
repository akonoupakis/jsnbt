/* global angular:false */
(function () {

    "use strict";
    
    angular.module('jsnbt')
        .filter("gravatar", function () {
            return function (input) {
                var md5 = new Hashes.MD5();
                return 'http://www.gravatar.com/avatar/' + md5.hex((input || '').toLowerCase());
            };
        });

})();