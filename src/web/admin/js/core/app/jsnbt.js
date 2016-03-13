(function () {
    "use strict";

    (function (jsnbt) {
        
        jsnbt.entities = (function (entities) {

            for (var entityName in entities) {
                var entity = entities[entityName];

                entity.editable = true;
                entity.viewable = false;
                entity.deletable = true;
                entity.parentable = true;

                entity.getCreateUrl = function (node) {
                    return '/content/nodes/new' + (node ? '-' + node.id : '');
                };
                entity.getEditUrl = function (node) {
                    return '/content/nodes/' + node.id
                };
                entity.getViewUrl = function (node) {
                    throw new Error('na');
                };


                if (entity.domain === 'core') {
                    entity.lookupNode = function (fn, mode, selected, options) {
                        fn.scope({
                            selected: selected,
                            domain: this.domain,
                            mode: mode
                        });
                        fn.scope(options || {});
                    };
                }
            }

            return entities;

        })(jsnbt.entities || {});

        jsnbt.lists = (function (lists) {

            _.each(lists, function (list) {

                list.lookupData = function (fn, mode, selected, options) {
                    fn.scope({
                        selected: selected,
                        domain: list.domain,
                        list: list.id,
                        mode: mode
                    });
                    fn.scope(options || {});
                };

            });

            return lists;

        })(jsnbt.lists || {});

        jsnbt.modules = (function (modules) {

            for (var moduleName in modules) {
                var module = modules[moduleName];

                module.lookupNode = function (fn, mode, selected, options) {
                    fn.scope({
                        selected: selected,
                        domain: this.domain,
                        mode: mode
                    });
                    fn.scope(options || {});
                };
            }

            modules.core = (function (coreModule) {

                coreModule.lookupNode = function (fn, mode, selected, options) {
                    fn.scope({
                        selected: selected,
                        domain: 'core',
                        mode: mode
                    });
                    fn.scope(options || {});
                };

                return coreModule;

            })(modules.core || {});

            return modules;

        })(jsnbt.modules || {});

        return jsnbt;

    })(jsnbt || {});

    (function () {
        "use strict";

        var modules = [];
        modules.push('ngPathRouter');
        modules.push('ngSanitize');
        modules.push('ngAnimate');
        modules.push('mgcrea.ngStrap');
        modules.push('ui.bootstrap');
        modules.push('ui.sortable');
        modules.push('infinite-scroll');
        modules.push('flow');
        modules.push('angular-redactor');
        modules.push('ngTagsInput');
        modules.push('bw.paging');

        for (var moduleDomain in jsnbt.modules) {
            if (jsnbt.modules[moduleDomain].domain !== 'public' && jsnbt.modules[moduleDomain].name)
                modules.push(jsnbt.modules[moduleDomain].name);
        }

        angular.module('jsnbt', modules);

    })();

})();