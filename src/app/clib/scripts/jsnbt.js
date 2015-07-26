var jsnbt = (function (jsnbt) {
    'use strict';

    jsnbt.version = '0.0.0';
    
    jsnbt.db = (function (db) {
        'use strict';
        
        db.on = function () {
            PROXY.on.apply(this, arguments);
        };

        db.once = function () {
            PROXY.once.apply(this, arguments);
        };

        db.off = function () {
            PROXY.off.apply(this, arguments);
        };

        return db;
    })(jsnbt.db || {});

    return jsnbt;
})(jsnbt || {});