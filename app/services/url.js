var app = require('../app.js');
var dpdSync = require('dpd-sync');
var pack = require('../package.js');
var parseUri = require('parseUri');
var nodeService = require('./node.js');
var languageService = require('./language.js');
var _ = require('underscore');

_.str = require('underscore.string');

module.exports = {

    getById: function (id, language) {
        var result = '';

        var node = nodeService.getById(id, language);
        if (node) {
            var languages = languageService.getActive();

            if (languages.length > 0) {
                if (languages.length > 1) {
                    result += '/' + node.language;
                }

                if (node.ref) {
                    result += node.ref.url.substring(0, node.ref.url.length - node.ref.seoName.length);
                }

                result += node.url;
            }
        }

        return result;
    },

    getByCode: function (domain, code, language) {
        var result = '';

        var node = nodeService.getByCode(domain, code, language);
        if (node) {
            var languages = languageService.getActive();

            if (languages.length > 0) {
                if (languages.length > 1) {
                    result += '/' + node.language;
                }

                if (node.ref) {
                    result += node.ref.url.substring(0, node.ref.url.length - node.ref.seoName.length);
                }

                result += node.url;
            }
        }

        return result;
    }

};