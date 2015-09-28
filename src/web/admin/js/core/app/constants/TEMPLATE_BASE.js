/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .constant('TEMPLATE_BASE', {
            base: 'tmpl/core/base/base.html',
            list: 'tmpl/core/base/list.html',
            tree: 'tmpl/core/base/list.html',
            form: 'tmpl/core/base/form.html',
            dataForm: 'tmpl/core/base/dataForm.html',
            nodeForm: 'tmpl/core/base/nodeForm.html',
            settings: 'tmpl/core/base/settings.html'
        });
})();