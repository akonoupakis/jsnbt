var _ = require('underscore');

var LocaleManager = function (server) {
    this.server = server;
};

LocaleManager.prototype.getDefault = function (cb) {

    if (this.server.app.localization.enabled) {
        var defaultLanguage = this.server.app.localization.locale;

        var store = this.server.db.createStore('languages');
        store.get(function (x) {
            x.query({
                active: true,
                "default": true
            });
            x.single();
            x.cached();
        }, function (err, language) {
            if (err)
                return cb(err);

            if (language)
                defaultLanguage = language.code;

            cb(null, defaultLanguage || 'en');
        });
    }
    else {
        cb(null, this.server.app.localization.locale);
    }

};

LocaleManager.prototype.getActive = function (cb) {

    if (this.server.app.localization.enabled) {
        var store = this.server.db.createStore('languages');
        store.get(function (x) {
            x.query({ active: true });
            x.fields(['code']);
        }, function (err, languages) {
            if (err)
                return cb(err);

            cb(null, _.pluck(languages, 'code'));
        });
    }
    else {
        cb(null, [this.server.app.localization.locale]);
    }

};

module.exports = function (server) {
    return new LocaleManager(server);
};