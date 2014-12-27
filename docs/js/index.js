/* global angular:false */

(function () {
    "use strict";

    angular.module('jsnbt', [])
        .config(function () {

        });

})();

$(document).ready(function () {

    angular.bootstrap(document, ['jsnbt']);

    //setTimeout(function () {
        //$('body').scrollspy({
        //    target: '#myNavbar',
        //    placement: 'top',
        //    offset: 190
        //});
        //$(".myMain").scrollspy({ target: "#myNavbar" });

        $('#myScrollspy').affix();
    //}, 1000);

});