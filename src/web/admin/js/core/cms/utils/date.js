/* global angular:false */
(function () {

    "use strict";
    
    angular.module('jsnbt')
        .filter("date", function () {
            return function (input, format) {
                var date = new Date(input);
                return moment(date).format(format);
            };
        });

})();