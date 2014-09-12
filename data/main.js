var app = require('../app/app.js');
var q = require('q');
var async = require('async');
var dpdSync = require('dpd-sync');
var _ = require('underscore');

var languages = ['en', 'es', 'el'];

var nodeDefault = {
    name: undefined,
    code: undefined,
    domain: undefined,
    entity: undefined,
    parent: '',
    order: 0,
    secure: false,
    locked: false,
    createdOn: new Date().getTime(),
    modifiedOn: new Date().getTime(),
    view: undefined,
    hierarchy: [],
    localization: {
        enabled: true,
        language: ''
    },
    data: {
        localized: {}
    },
    config: {}
};

var nodeLocalizedDefault = {
    active: true,
    seoName: undefined,
    link: undefined,
    content: undefined,
    pointer: undefined,
    meta: {
        title: undefined,
        description: undefined,
        keywords: undefined
    }
};

var insertLanguage = function (code, name, isActive, isDefault) {
    var result = dpdSync.call(app.dpd.languages.post, { code: code, name: name, active: isActive, "default": isDefault });
    if (!result)
        throw new Error('Could not save language: ' + code);
    
    app.logger.info('added language: ' + code);

    return result;
};

var counter = 0;

var insertNode = function (domain, entity, code, parent, friendly, view) {

    var node = {};

    _.extend(node, nodeDefault, {
        name: 'name ' + code || entity,
        code: code,
        domain: domain,
        entity: entity,
        parent: parent || '',
        locked: code === 'home' || code === 'login',
        view: view,
        order: counter
    });

    for (var i = 0; i < languages.length; i++) {
        var language = languages[i];
        node.data.localized[language] = {};
        _.extend(node.data.localized[language], nodeLocalizedDefault, {
            seoName: friendly,
            content: {
                title: entity + ':' + code + " title " + language,
                body: entity + ':' + code + " content " + language
            },
            meta: {
                title: entity + ':' + code + " meta title " + language,
                description: entity + ':' + code + " meta description " + language,
                keywords: entity + ':' + code + " meta keywords " + language
            }
        });
    }

    var result = dpdSync.call(app.dpd.nodes.post, node);
    if (!result)
        throw new Error('Could not save node: ' + friendly);
    
    app.logger.info('added "' + domain + '" node of type "' + entity + '":' + (code !== undefined ? ' (' + code + ')' : '') + ' ' + friendly);

    counter++;

    return result;
};

var insertPointer = function (code, parent, friendly, pointer) {
    var node = {};
    
    _.extend(node, nodeDefault, {
        name: 'name ' + code || entity,
        code: code,
        domain: 'core',
        entity: 'pointer',
        parent: parent || '',
        pointer: pointer,
        order: counter
    });

    for (var i = 0; i < languages.length; i++) {
        var language = languages[i];
        node.data.localized[language] = {};
        _.extend(node.data.localized[language], nodeLocalizedDefault, {
            seoName: friendly,
            pointer: {
                title: 'pointer:' + code + " title " + language,
                content: 'pointer:' + code + " content " + language
            },
            meta: {
                title: 'pointer:' + code + " meta title " + language,
                description: 'pointer:' + code + " meta description " + language,
                keywords: 'pointer:' + code + " meta keywords " + language
            }
        });
    }
    
    var result = dpdSync.call(app.dpd.nodes.post, node);
    if (!result)
        throw new Error('Could not save node: ' + friendly);
    
    app.logger.info('added "core" node of type "pointer":' + (code !== undefined ? ' (' + code + ')' : '') + ' ' + friendly);

    counter++;

    return result;
};

var insertLink = function (code, parent, friendly, url) {
    var node = {};

    _.extend(node, nodeDefault, {
        name: 'name ' + code || entity,
        code: code,
        domain: 'core',
        entity: 'link',
        parent: parent || '',
        order: counter
    });

    for (var i = 0; i < languages.length; i++) {
        var language = languages[i];
        node.data.localized[language] = {};
        _.extend(node.data.localized[language], nodeLocalizedDefault, {
            seoName: friendly,
            link: {
                url: url,
                target: '_blank',
                title: 'url link'
            }
        });
    }

    var result = dpdSync.call(app.dpd.nodes.post, node);
    if (!result)
        throw new Error('Could not save node: ' + friendly);
    
    app.logger.info('added "core" node of type "link":' + (code !== undefined ? ' (' + code + ')' : '') + ' ' + friendly);

    counter++;

    return result;
};

module.exports = function () {

    try {

        /// main
        insertLanguage('en', 'English', true, true);
        insertLanguage('es', 'Spanish', true, false);
        insertLanguage('el', 'Greek', true, false);
        
        insertNode('core', 'page', 'home', undefined, '', '/tmpl/view/index.html');

        var solutionsPage = insertNode('core', 'page', 'solutions', undefined, 'solutions', '/tmpl/view/text.html');
        insertNode('core', 'page', 'solution1', solutionsPage.id, 'solution-one', '/tmpl/view/text.html');
        var solutions2Page = insertNode('core', 'page', 'solution2', solutionsPage.id, 'solution-two', '/tmpl/view/text.html');
        insertNode('core', 'page', 'soln', solutions2Page.id, 'solution-nulld', '/tmpl/view/text.html');
        var solutions3Page = insertNode('core', 'page', 'solutions3', solutions2Page.id, 'solution-three', '/tmpl/view/text.html');
        insertNode('core', 'page', 'solutions4', solutions3Page.id, 'solution-four', '/tmpl/view/text.html');

        var plansPage = insertNode('core', 'page', 'plans', undefined, 'plans', '/tmpl/view/text.html');
        insertNode('core', 'page', 'plan1', plansPage.id, 'plan-one', '/tmpl/view/text.html');
        insertNode('core', 'page', 'plan2', plansPage.id, 'plan-two', '/tmpl/view/text.html');

        var aboutPage = insertNode('core', 'page', 'about', undefined, 'about', '/tmpl/view/text.html');
        insertNode('core', 'page', 'team', aboutPage.id, 'team', '/tmpl/view/text.html');

        var contactPage = insertNode('core', 'page', 'contact', undefined, 'contact-us', '/tmpl/view/contact.html');
        insertNode('core', 'page', 'map', contactPage.id, 'map', '/tmpl/view/map.html');
        
        /// blog
        var blogANode = insertNode('blog', 'blog', 'blogA', undefined, 'blog-a', '/tmpl/view/text.html');
        
        insertNode('blog', 'blog-entry', undefined, blogANode.id, 'blog-entry-one', '/tmpl/view/text.html');
        insertNode('blog', 'blog-entry', undefined, blogANode.id, 'blog-entry-two', undefined);
        insertNode('blog', 'blog-entry', undefined, blogANode.id, 'blog-entry-three', undefined);
        insertNode('blog', 'blog-entry', undefined, blogANode.id, 'blog-entry-four', undefined);
        insertNode('blog', 'blog-entry', undefined, blogANode.id, 'blog-entry-five', '/tmpl/view/text.html');
        insertNode('blog', 'blog-entry', undefined, blogANode.id, 'blog-entry-six', '/tmpl/view/text.html');
        insertNode('blog', 'blog-entry', undefined, blogANode.id, 'blog-entry-seven', '/tmpl/view/text.html');
        insertNode('blog', 'blog-entry', undefined, blogANode.id, 'blog-entry-eight', '/tmpl/view/text.html');
        
        var blogBNode = insertNode('blog', 'blog', 'blogB', undefined, 'blog-b', '/tmpl/view/text.html');
        insertNode('blog', 'blog-entry', undefined, blogBNode.id, 'blog-entry-nighn', '/tmpl/view/text.html');
        insertNode('blog', 'blog-entry', undefined, blogBNode.id, 'blog-entry-ten', '/tmpl/view/text.html');
        insertNode('blog', 'blog-entry', undefined, blogBNode.id, 'blog-entry-eleven', '/tmpl/view/text.html');
        insertNode('blog', 'blog-entry', undefined, blogBNode.id, 'blog-entry-twelve', '/tmpl/view/text.html');
        insertNode('blog', 'blog-entry', undefined, blogBNode.id, 'blog-entry-thirteen', '/tmpl/view/text.html');
        
        /// blog pages
        insertPointer('blog1', undefined, 'blogga', { domain: 'blog', nodeId: blogANode.id });
        insertPointer('blog2', undefined, 'bloggb', { domain: 'blog', nodeId: blogBNode.id });

        /// eshop
        var shoesNode = insertNode('eshop', 'product-category', 'shoes', undefined, 'shoes', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, shoesNode.id, 'shoe-one', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, shoesNode.id, 'shoe-two', '/tmpl/view/text.html');
        var shoesCatNode1 = insertNode('eshop', 'product-category', 'all star', shoesNode.id, 'all-star', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, shoesCatNode1.id, 'shoe-three', '/tmpl/view/text.html');
        var shoesCatNode2 = insertNode('eshop', 'product-category', 'nike', shoesNode.id, 'nike', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, shoesCatNode2.id, 'shoe-four', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, shoesCatNode2.id, 'shoe-five', '/tmpl/view/text.html');
        var shoesCatNode3 = insertNode('eshop', 'product-category', 'pumma', shoesNode.id, 'pumma', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, shoesCatNode3.id, 'shoe-six', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, shoesCatNode3.id, 'shoe-seven', '/tmpl/view/text.html');

        var tshirtsNode = insertNode('eshop', 'product-category', 't-shirts', undefined, 't-shirts', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, tshirtsNode.id, 'tshirt-one', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, tshirtsNode.id, 'tshirt-two', '/tmpl/view/text.html');
        var tshirtsCatNode1 = insertNode('eshop', 'product-category', 'crok', tshirtsNode.id, 'crok', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, tshirtsCatNode1.id, 'tshirt-three', '/tmpl/view/text.html');
        var tshirtsCatNode2 = insertNode('eshop', 'product-category', 'timberlant', tshirtsNode.id, 'timberlant', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, tshirtsCatNode2.id, 'tshirt-four', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, tshirtsCatNode2.id, 'tshirt-five', '/tmpl/view/text.html');

        var jacketsNode = insertNode('eshop', 'product-category', 'jackets', undefined, 'jackets', '/tmpl/view/text.html');
        var jacketsCatNode1 = insertNode('eshop', 'product-category', 'leather', jacketsNode.id, 'leather', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, jacketsCatNode1.id, 'jacket-one', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, jacketsCatNode1.id, 'jacket-two', '/tmpl/view/text.html');
        var jacketsCatNode2 = insertNode('eshop', 'product-category', 'wint', jacketsNode.id, 'wint', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, jacketsCatNode2.id, 'jacket-three', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, jacketsCatNode2.id, 'jacket-four', '/tmpl/view/text.html');

        var pantsNode = insertNode('eshop', 'product-category', 'pants', undefined, 'pants', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, pantsNode.id, 'pants-one', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, pantsNode.id, 'pants-two', '/tmpl/view/text.html');

        var underwearNode = insertNode('eshop', 'product-category', 'underwear', undefined, 'underwear', '/tmpl/view/text.html');
        insertNode('eshop', 'product', undefined, underwearNode.id, 'underwear-one', '/tmpl/view/text.html');
        var prodPage = insertNode('eshop', 'product', undefined, underwearNode.id, 'underwear-two', '/tmpl/view/text.html');

        /// eshop pages
        var productsPage = insertNode('core', 'page', 'products', undefined, 'products', '/tmpl/view/text.html');
        insertPointer('shoes', productsPage.id, 'shoes', { domain: 'eshop', nodeId: shoesNode.id });
        insertPointer('tshirts', productsPage.id, 'tshirts', { domain: 'eshop', nodeId: tshirtsNode.id });
        insertPointer('jackets', productsPage.id, 'jackets', { domain: 'eshop', nodeId: jacketsNode.id });
        insertPointer('underwear', productsPage.id, 'underwear', { domain: 'eshop', nodeId: underwearNode.id });
        insertPointer('prod pointer', productsPage.id, 'prodpointer', { domain: 'eshop', nodeId: prodPage.id });

        insertLink('link-test', undefined, 'linktest', 'http://www.in.gr/');
    }
    catch (err) {
        app.logger.error(err);
    }
};