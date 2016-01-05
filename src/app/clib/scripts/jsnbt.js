var jsnbt = (function (jsnbt) {
    'use strict';

    jsnbt.version = '0.0.0';
    
    jsnbt.db = (function (db) {
        
        for (var collection in jsnbt.collections) {
            db[collection] = new PROXY(collection);
        };

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

    var getSubRoles = function (role) {
        var results = [];

        if (jsnbt.roles[role]) {
            var matchedRole = jsnbt.roles[role];

            results.push(role);

            if (matchedRole.inherits) {
                for (var mr1 = 0; mr1 < matchedRole.inherits.length ; mr1++) {
                    var matchedRoleItem = matchedRole.inherits[mr1];
                    var allRoles = getSubRoles(matchedRoleItem);
                    for (var mr2 = 0; mr2 < allRoles.length ; mr2++) {
                        var rol = allRoles[mr2];
                        if (results.indexOf(rol) === -1) {
                            results.push(rol);
                        }
                    }
                }
            }
        }

        return results;
    };

    var getUserRoles = function (user) {
        var roles = (user || {}).roles || ['public'];

        var allRoles = [];

        for (var mr1 = 0; mr1 < roles.length ; mr1++) {
            var itemRoles = getSubRoles(roles[mr1]);
            for (var mr2 = 0; mr2 < itemRoles.length ; mr2++) {
                if (allRoles.indexOf(itemRoles[mr2]) === -1) {
                    allRoles.push(itemRoles[mr2]);
                }
            }
        }

        return allRoles;
    }

    var isUserAuthorized = function (user, section, permission) {

        var result = false;

        if (jsnbt.collections[section]) {

            if (jsnbt.collections[section].permissions === false) {
                result = true;
            }
            else if (jsnbt.collections[section].permissions) {
                var roles = getUserRoles(user);
                result = false;

                for (var p = 0; p < jsnbt.collections[section].permissions.length; p++) {
                    var perm = jsnbt.collections[section].permissions[p];
                    if (roles.indexOf(perm.role) !== -1) {
                        if (perm.crud.indexOf(permission) !== -1)
                            result = true;
                    }
                }
            }
        }

        return result;
    }

    var isUserNodeAuthorized = function (user, section, permission) {
        var sectionParts = section.split(':');
        if (sectionParts.length === 2) {
            var dataName = sectionParts[0];
            var entityName = sectionParts[1];

            if (jsnbt.entities[entityName] && jsnbt.entities[entityName].permissions) {
                var roles = getUserRoles(user);
                var result = false;

                for (var p = 0; p < jsnbt.entities[entityName].permissions.length; p++) {
                    var perm = jsnbt.entities[entityName].permissions[p];
                    if (roles.indexOf(perm.role) !== -1) {
                        if (perm.crud.indexOf(permission) !== -1)
                            result = true;
                    }
                }

                return result;
            }
            else {
                return isUserAuthorized(user, 'nodes', permission);
            }
        }
        else {
            return isUserAuthorized(user, 'nodes', permission);
        }
    }

    var isUserDataAuthorized = function (user, section, permission) {
        var sectionParts = section.split(':');
        if (sectionParts.length === 3) {
            var dataName = sectionParts[0];
            var domainName = sectionParts[1];
            var listName = sectionParts[2];

            var found = false;
            var result = false;

            for (var l = 0; l < jsnbt.lists.length && !found; l++) {
                var list = jsnbt.lists[l];
                if (list.domain === domainName && list.id === listName && list.permissions) {
                    found = true;

                    var roles = getUserRoles(user);

                    for (var p = 0; p < list.permissions.length; p++) {
                        var perm = list.permissions[p];
                        if (roles.indexOf(perm.role) !== -1) {
                            if (perm.crud.indexOf(permission) !== -1)
                                result = true;
                        }
                    }
                }
            }

            if (found) {
                return result;
            }
            else {
                return isUserAuthorized(user, 'data', permission);
            }
        }
        else {
            return isUserAuthorized(user, 'data', permission);
        }
    }

    jsnbt.auth = (function (auth) {

        auth.isInRole = function (user, role) {
            var roles = getUserRoles(user);

            if (typeof (role) === 'string') {
                return roles.indexOf(role) !== -1;
            }
            else {
                var result = false;
                var breaked = false;

                for (var i = 0; i < roles.length && !breaked; i++) {
                    var r = roles[i];
                    if (role.indexOf(r) !== -1) {
                        result = true;
                        breaked = true;
                    }
                };

                return result;
            }
        };

        auth.isAuthorized = function (user, section, permission) {
            if (!user)
                return false;

            if (section.indexOf(':') !== -1) {
                var sectionParts = section.split(':');
                if (sectionParts[0] === 'data') {
                    return isUserDataAuthorized(user, section, permission);
                }
                else if (sectionParts[0] === 'nodes') {
                    return isUserNodeAuthorized(user, section, permission);
                }
                else {
                    return isUserAuthorized(user, section, permission);
                }
            }
            else {
                return isUserAuthorized(user, section, permission);
            }
        };

        return auth;

    })(jsnbt.auth || {});
    
    jsnbt.image = (function (image) {

        image.build = function (src, gen) {
            if (!src)
                return;

            if (typeof (gen) === 'string') {
                return src += '?type=' + gen;
            }
            else if (typeof (gen) === 'object') {
                return src += '?type=custom&processors=' + encodeURIComponent(JSON.stringify(gen));
            }
            else {
                return src;
            }
        };

        return image;

    })(jsnbt.image || {});

    jsnbt.url = (function (url) {

        url.build = function (language, page, pointer) {

            if (page.entity === 'pointer') {
                return page.enabled[language] ? page.url[language] : undefined;
            }
            else {

                if (page.domain === 'core') {
                    return page.enabled[language] ? page.url[language] : undefined;
                }
                else {
                    if (pointer) {
                        if (pointer.enabled[language] && page.enabled[language]) {
                            var pointerNodeIndex = page.hierarchy.indexOf(pointer.pointer.nodeId);
                            if (pointerNodeIndex !== -1) {
                                var cropUrlIndex = pointerNodeIndex + 1;
                                var pageUrlParts = (page.url[language] || '').split('/');
                                if (pageUrlParts.length >= cropUrlIndex) {
                                    var remainingUrl = _.str.ltrim(page.url[language], '/').split('/').slice(cropUrlIndex).join('/');
                                    var resultUrl = pointer.url[language];
                                    if (remainingUrl !== '')
                                        resultUrl += '/' + remainingUrl;
                                    return resultUrl;
                                }
                            }
                        }
                    }
                    else {
                        if (page.enabled[language]) {
                            return page.url[language];
                        }
                    }
                }
            }
        };

        return url;

    })(jsnbt.url || {});
    
    jsnbt.text = (function (text) {

        var getLocalizationObject = function (item, language) {
            var keyParts = item.key.split('.');

            var loopObject = {};
            var finalObject = loopObject;
            while (keyParts.length > 0) {
                var keyPart = keyParts.shift();

                var objValue = undefined;
                if (keyParts.length > 0) {
                    objValue = {};
                }
                else {
                    objValue = item.value[language];
                }

                loopObject[keyPart] = objValue;

                if (keyParts.length > 0) {
                    loopObject = loopObject[[keyPart]];
                }
            }

            return finalObject;
        };

        text.get = function (language, match, cb) {
            var matches = typeof (match) === 'string' ? [match] : match;

            jsnbt.db.texts.get({
                $or: [{
                    key: {
                        $in: matches
                    }
                }, {
                    group: {
                        $in: matches
                    }
                }]
            }, function (error, results) {
                if (error) {
                    cb(error, null);
                }
                else {
                    var returnObj = {};

                    $(results).each(function (i, item) {
                        var localizationObject = getLocalizationObject(item, language);

                        if (item.group && item.group !== '') {
                            returnObj[item.group] = returnObj[item.group] || {};
                            $.extend(true, returnObj[item.group], localizationObject);
                        }
                        else {
                            $.extend(true, returnObj, localizationObject);
                        }
                    });

                    cb(null, returnObj);
                }
            });
        };

        return text;

    })(jsnbt.text || {});

    return jsnbt;
})(jsnbt || {});