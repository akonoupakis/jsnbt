(function () {
    "use strict";
    
    (function (jsnbt) {

        jsnbt.constants = (function (constants) {

            constants.TEMPLATE_BASE = {
                base: 'tmpl/core/base/base.html',
                list: 'tmpl/core/base/list.html',
                tree: 'tmpl/core/base/tree.html',
                form: 'tmpl/core/base/form.html',
                dataForm: 'tmpl/core/base/dataForm.html',
                nodeForm: 'tmpl/core/base/nodeForm.html',
                settings: 'tmpl/core/base/settings.html'
            };

            return constants;

        })(jsnbt.constants || {});
                
        return jsnbt;

    })(jsnbt || {});

})();