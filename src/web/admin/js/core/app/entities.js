/* global angular:false */

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
                    entity.lookup = function (selected, options) {
                        var entityDomain = this.domain;
                        var lookupOptions = {};
                        $.extend(true, lookupOptions, {
                            title: 'select a content node',
                            controller: 'NodeSelectorController',
                            selected: selected,
                            template: 'tmpl/core/modals/nodeSelector.html',
                            domain: entityDomain,
                            mode: 'single',
                            options: options
                        });
                        return lookupOptions;
                    };

                    entity.lookupMany = function (selected, options) {
                        var entityDomain = this.domain;
                        var lookupOptions = {};
                        $.extend(true, lookupOptions, {
                            title: 'select the content nodes you want',
                            controller: 'NodeSelectorController',
                            selected: selected,
                            template: 'tmpl/core/modals/nodeSelector.html',
                            domain: entityDomain,
                            mode: 'multiple',
                            options: options
                        });
                        return lookupOptions;
                    };
                }
            }

            return entities;

        })(jsnbt.entities || {});

        return jsnbt;

    })(jsnbt || {});
    
})();