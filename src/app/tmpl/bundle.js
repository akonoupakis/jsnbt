var md5 = require('MD5');
var _ = require('underscore');
_.str = require('underscore.string');

var Bundle = function (app) {

    var getScriptRaw = function (data) {
        var result = [];

        var addBundleInfo = function (groupsNames) {
            var combine = true;

            if (groupsNames.length > 0) {

                var groups = _.filter(_.map(groupsNames, function (x) {
                    return _.find(app.config.scripts, function (y) {
                        return x === y.name
                    });
                }), function (z) { return z !== undefined; });

                if (groups.length > 1) {
                    if (_.filter(groups, function (x) { return x.process === false; }).length > 1) {
                        combine = false;
                    }
                }
                
                if (combine) {
                    var groupsScripts = [];
                    _.each(groups, function (g) {
                        if (g.items && _.isArray(g.items)) {
                            _.each(g.items, function (gi) {
                                groupsScripts.push(gi);
                            });
                        }
                    });

                    if (groupsScripts.length > 0) {
                        var hashKey = groupsScripts.join(';');
                        var hashedKey = md5(hashKey);
                        var hashedScript = '/tmp/scripts/' + hashedKey + '.js';
                        result.push({
                            items: groupsScripts,
                            target: hashedScript
                        });
                    }
                }
            }
        };

        _.each(data, function (tmplScript) {
            if (_.isString(tmplScript)) {
                addBundleInfo([tmplScript]);
            }
            if (_.isArray(tmplScript)) {
                addBundleInfo(tmplScript);
            }
        });

        return result;
    };

    var getScriptBundle = function (data) {
        var scripts = [];

        var addGroupScripts = function (group) {
            if (app.config.scripts[group] && _.isArray(app.config.scripts[group].items)) {
                _.each(app.config.scripts[group].items, function (groupItem) {
                    scripts.push(groupItem);
                });
            }
        }

        var addCombinedScripts = function (groupsNames) {

            var combine = true;

            if (groupsNames.length > 0) {

                var groups = _.filter(_.map(groupsNames, function (x) {
                    return _.find(app.config.scripts, function (y) {
                        return x === y.name
                    });
                }), function (z) { return z !== undefined; });

                if (groups.length > 1) {
                    if (_.filter(groups, function (x) { return x.process === false; }).length > 1) {
                        combine = false;
                    }
                }

                var groupsScripts = [];
                _.each(groups, function (g) {
                    if (g.items && _.isArray(g.items)) {
                        _.each(g.items, function (gi) {
                            groupsScripts.push(gi);
                        });
                    }
                });

                if (groupsScripts.length > 0) {
                    if (combine) {
                        var hashKey = groupsScripts.join(';');
                        var hashedKey = md5(hashKey);
                        var hashedScript = '/tmp/scripts/' + hashedKey + '.js';
                        scripts.push(hashedScript);
                    }
                    else {
                        _.each(groupsScripts, function (gi) {
                            scripts.push(gi);
                        });
                    }
                }
            }

        };

        if (app.environment === 'dev') {
            _.each(data, function (tmplScript) {
                if (_.isString(tmplScript)) {
                    addGroupScripts(tmplScript);
                }
                if (_.isArray(tmplScript)) {
                    _.each(tmplScript, function (tmplScriptItem) {
                        addGroupScripts(tmplScriptItem);
                    });
                }
            });
        }
        else {
            _.each(data, function (tmplScript) {
                if (_.isString(tmplScript)) {
                    addCombinedScripts([tmplScript]);
                }
                if (_.isArray(tmplScript)) {
                    addCombinedScripts(tmplScript);
                }
            });
        }

        return scripts;
    };

    var getStyleRaw = function (data) {
        var result = [];

        var addBundleInfo = function (groupsNames) {
            var combine = true;

            if (groupsNames.length > 0) {

                var groups = _.filter(_.map(groupsNames, function (x) {
                    return _.find(app.config.styles, function (y) {
                        return x === y.name
                    });
                }), function (z) { return z !== undefined; });

                if (groups.length > 1) {
                    if (_.filter(groups, function (x) { return x.process === false; }).length > 1) {
                        combine = false;
                    }
                }

                if (combine) {
                    var groupsStyles = [];
                    _.each(groups, function (g) {
                        if (g.items && _.isArray(g.items)) {
                            _.each(g.items, function (gi) {
                                groupsStyles.push(gi);
                            });
                        }
                    });

                    if (groupsStyles.length > 0) {
                        var hashKey = groupsStyles.join(';');
                        var hashedKey = md5(hashKey);
                        var hashedStyle = '/tmp/styles/' + hashedKey + '.css';
                        result.push({
                            items: groupsStyles,
                            target: hashedStyle
                        });
                    }
                }
            }
        };

        _.each(data, function (tmplStyle) {
            if (_.isString(tmplStyle)) {
                addBundleInfo([tmplStyle]);
            }
            if (_.isArray(tmplStyle)) {
                addBundleInfo(tmplStyle);
            }
        });

        return result;
    };

    var getStyleBundle = function (data) {
        var styles = [];

        var addGroupStyles = function (group) {
            if (app.config.styles[group] && _.isArray(app.config.styles[group].items)) {
                _.each(app.config.styles[group].items, function (groupItem) {
                    styles.push(groupItem);
                });
            }
        }

        var addCombinedStyles = function (groupsNames) {

            var combine = true;

            if (groupsNames.length > 0) {

                var groups = _.filter(_.map(groupsNames, function (x) {
                    return _.find(app.config.styles, function (y) {
                        return x === y.name
                    });
                }), function (z) { return z !== undefined; });

                if (groups.length > 1) {
                    if (_.filter(groups, function (x) { return x.process === false; }).length > 1) {
                        combine = false;
                    }
                }

                var groupsStyles = [];
                _.each(groups, function (g) {
                    if (g.items && _.isArray(g.items)) {
                        _.each(g.items, function (gi) {
                            groupsStyles.push(gi);
                        });
                    }
                });

                if (groupsStyles.length > 0) {
                    if (combine) {
                        var hashKey = groupsStyles.join(';');
                        var hashedKey = md5(hashKey);
                        var hashedStyle = '/tmp/styles/' + hashedKey + '.css';
                        styles.push(hashedStyle);
                    }
                    else {
                        _.each(groupsStyles, function (gi) {
                            styles.push(gi);
                        });
                    }
                }
            }

        };

        _.each(data, function (tmplStyle) {
            if (_.isString(tmplStyle)) {
                addCombinedStyles([tmplStyle]);
            }
            if (_.isArray(tmplStyle)) {
                addCombinedStyles(tmplStyle);
            }
        });

        return styles;
    };

    return {

        getScriptBundle: function (data) {
            return {
                raw: getScriptRaw(data),
                items: getScriptBundle(data)
            };
        },

        getStyleBundle: function (data) {
            return {
                raw: getStyleRaw(data),
                items: getStyleBundle(data)
            };
        }

    };

};

module.exports = Bundle;