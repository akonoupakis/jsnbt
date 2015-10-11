/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {
        
        jsnbt.modules = (function (modules) {

            for (var moduleName in modules) {
                var module = modules[moduleName];

                module.lookup = function (fn, selected, options) {
                    fn.scope({
                        selected: selected,
                        domain: this.domain,
                        mode: 'single',
                        options: options
                    });
                };

                module.lookupMany = function (fn, selected, options) {
                    fn.scope({
                        selected: selected,
                        domain: this.domain,
                        mode: 'multiple',
                        options: options
                    });
                };
            }

            modules.core = (function (coreModule) {

                coreModule.lookup = function (fn, selected, options) {
                    fn.scope({
                        selected: selected,
                        domain: 'core',
                        mode: 'single',
                        options: options
                    });
                };

                coreModule.lookupMany = function (fn, selected, options) {
                    fn.scope({
                        selected: selected,
                        domain: 'core',
                        mode: 'multiple',
                        options: options
                    });
                };

                return coreModule;

            })(modules.core || {});

            return modules;

        })(jsnbt.modules || {});

        return jsnbt;

    })(jsnbt || {});
    
})();