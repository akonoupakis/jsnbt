/* global angular:false */

(function () {

    "use strict";

    var modules = [];
    modules.push('ngRoute');
    modules.push('ngAnimate');
    modules.push('ngSanitize');
    modules.push('mgcrea.ngStrap');
    modules.push('ui.bootstrap');
    modules.push('ui.sortable');
    modules.push('infinite-scroll');
    modules.push('flow');
    modules.push('angular-redactor');

    for (var moduleDomain in jsnbt.modules) {
        if (jsnbt.modules[moduleDomain].domain !== 'public' && jsnbt.modules[moduleDomain].name)
            modules.push(jsnbt.modules[moduleDomain].name);
    }
    
    angular.module('jsnbt', modules);
    
})();