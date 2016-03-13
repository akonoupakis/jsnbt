var md5 = require('md5');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
_.str = require('underscore.string');

var getScriptRaw = function (app, data) {
    var result = [];

    var addBundleInfo = function (groupsNames) {
        var combine = true;

        if (groupsNames.length > 0) {

            var groups = _.filter(_.map(groupsNames, function (x) {
                return _.find(app.config.scripts, function (y) {
                    return x === y.name
                });
            }), function (z) { return z !== undefined; });

            if (_.any(groups, function (x) { return x.process === false; })) {
                combine = false;
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

var getScriptBundle = function (app, data) {
    var scripts = [];

    appendScript = function (file) {
        var filePath = app.root.mapPath(path.join('www/public', file));

        if (fs.existsSync(filePath)) {
            var stats = fs.statSync(filePath);
            scripts.push(file + '?r=' + stats.mtime.getTime());
        }
        else {
            scripts.push(file);
        }
    }

    var addGroupScripts = function (group) {
        if (app.config.scripts[group] && _.isArray(app.config.scripts[group].items)) {
            _.each(app.config.scripts[group].items, function (groupItem) {
                appendScript(groupItem);
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

            if (_.any(groups, function (x) { return x.process === false; })) {
                combine = false;
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

                    appendScript(hashedScript);
                }
                else {
                    _.each(groupsScripts, function (gi) {
                        appendScript(gi);
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

var getStyleRaw = function (app, data) {
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

var getStyleBundle = function (app, data) {
    var styles = [];

    appendStyle = function (file) {
        var filePath = app.root.mapPath(path.join('www/public', file));

        if (fs.existsSync(filePath)) {
            var stats = fs.statSync(filePath);
            styles.push(file + '?r=' + stats.mtime.getTime());
        }
        else {
            styles.push(file);
        }
    }

    var addGroupStyles = function (group) {
        if (app.config.styles[group] && _.isArray(app.config.styles[group].items)) {
            _.each(app.config.styles[group].items, function (groupItem) {
                appendStyle(groupItem);
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
                    appendStyle(hashedStyle);
                }
                else {
                    _.each(groupsStyles, function (gi) {
                        appendStyle(gi);
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

var Bundle = function (app) {
    this.app = app;
};

Bundle.prototype.getScriptBundle = function (data) {
    return {
        raw: getScriptRaw(this.app, data),
        items: getScriptBundle(this.app, data)
    };
};

Bundle.prototype.getStyleBundle = function (data) {
    return {
        raw: getStyleRaw(this.app, data),
        items: getStyleBundle(this.app, data)
    };
};

module.exports = function (app) {
    return new Bundle(app);
};