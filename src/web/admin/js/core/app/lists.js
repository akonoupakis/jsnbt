/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {
        
        jsnbt.lists = (function (lists) {

            _.each(lists, function (list) {

                list.lookupData = function (fn, mode, selected, options) {
                    fn.scope({
                        selected: selected,
                        domain: list.domain,
                        list: list.id,
                        mode: mode,
                        options: options || {}
                    });
                };

            });

            return lists;

        })(jsnbt.lists || {});

        return jsnbt;

    })(jsnbt || {});
    
})();