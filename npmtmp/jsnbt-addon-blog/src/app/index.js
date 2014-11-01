var packInfo = require('../../package.json');

module.exports = {

    addon: true,

    domain: 'blog',

    version: packInfo.version,

    entities: [{
        name: 'blog-entry',
        treeNode: false,
        localized: false,

        properties: {
            name: false,
            parent: false,
            template: false,
            seo: false,
            meta: false,
            permissions: false
        }
    }, {
        name: 'blog',
        allowed: ['blog-entry'],
        treeNode: true,
        localized: false,

        properties: {
            name: true,
            parent: false,
            template: true,
            seo: true,
            meta: false,
            permissions: false
        }
    }],

    modules: {
        public: ['jsnbt-addon-blog'],
        admin: ['jsnbt-addon-blog']
    },

    templates: [{
        path: '/tmpl/view/blog/index.html'
    }],

    config: {

    },

    init: function (appplication) {

    },

    route: function (ctx) {
        if (ctx.node) {
            ctx.render();
        }
        else {
            ctx.error(404);
        }
    },

    resolve: function (ctx, cb) {

        if (ctx.seoNames.length === 0) {
            ctx.page = ctx.pointed;
            ctx.view = ctx.pointed.view;
            cb(ctx);
        }
        else {
            if (ctx.seoNames.length === 1) {
                ctx.dpd.nodes.get({
                    parent: ctx.pointed.id,
                    id: ctx.seoNames[0],
                    domain: 'blog'
                }, function (response, error) {
                    if (error) {
                        cb(ctx);
                    }
                    else {
                        if (response) {
                            ctx.page = response;
                            ctx.view = ctx.pointed.data.template
                        }
                        cb(ctx);
                    }
                });
            }
            else {
                cb(ctx);
            }
        }

    },

    build: function (ctx, cb) {

        if (ctx.node.entity === 'blog')
        {
            for (var langItem in ctx.node.url) {
                ctx.url[langItem] = '/' + ctx.node.url[langItem];
            }

            cb(ctx.url);
        }
        else if (ctx.node.entity === 'blog-entry')
        {
            for (var langItem in ctx.url) {
                if (ctx.url[langItem])
                    ctx.url[langItem] += '/' + ctx.node.id;
            }

            cb(ctx.url);
        }
        else {
            cb({});
        }
    }

};