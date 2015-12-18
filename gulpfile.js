var gulp = require('gulp');
var del = require('del');
var preprocess = require('gulp-preprocess');
var less = require('gulp-less');
var rename = require("gulp-rename");
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var runSequence = require('run-sequence').use(gulp);
var eventStream = require('event-stream');
var ngTemplates = require('gulp-ng-templates');
var htmlmin = require('gulp-htmlmin');

var fs = require('fs-extra');
var path = require('path');
var server = require('server-root');
var _ = require('underscore');

_.str = require('underscore.string');

var TARGET_FOLDER = 'www';

var app = new require('./src/app/app.js')();
var appMode = 'DEVELOPMENT';

var modulePaths = [];
var moduleNames = [];

var getModuleFolderPath = function (installedPath) {
    var modulePath = installedPath.split('/')
    modulePath.pop();
    modulePath.pop();
    modulePath = modulePath.join('/');
    return modulePath;
}

gulp.task('copyLocalBowerComponents', function () {
    gulp.src('./bower/**')
        .pipe(gulp.dest('./bower_components'));
});

gulp.task('copyLocalNodeModules', function () {
    gulp.src('./npm/**')
        .pipe(gulp.dest('./node_modules'));
});

gulp.task('loadModules', function () {

    var paths = [];
    _.each(modulePaths, function (modulePath) {
        var mPath = getModuleFolderPath(modulePath);
        mPath = mPath.replace(/\//g, '\\') + '\\';
        paths.push(mPath);
    });

    Object.keys(require.cache).forEach(function (key) {
        var strippedKey = key.substring(__dirname.length + 1);
        if (_.any(paths, function (x) {
            return strippedKey.indexOf(x) === 0;
        }))
            delete require.cache[key];
    });

    app = new require('./src/app/app.js')();

    modulePaths = [];

    var getModule = function (indexPath) {
        if (fs.existsSync(indexPath)) {
            var packObject = require(indexPath);
            if (packObject && packObject.domain) {
                return packObject;
            }
        }
        return undefined;
    }

    moduleNames = [];

    var mainPackageInfoPath = server.getPath('package.json');
    if (fs.existsSync(mainPackageInfoPath)) {
        var mainPackInfo = require(mainPackageInfoPath);
        if (mainPackInfo.main) {

            var module = getModule(server.getPath(mainPackInfo.main));
            if (module) {
                if (module.domain === 'core') {
                    modulePaths.push(mainPackInfo.main);
                    moduleNames.push('jsnbt');
                    app.register(module);
                }
            }
        }
    }

    if (fs.existsSync(server.getPath('node_modules'))) {
        var packages = fs.readdirSync(server.getPath('node_modules'));
        _.each(packages, function (packageItem) {

            if (_.str.startsWith(packageItem, 'jsnbt')) {
                if (moduleNames.indexOf(packageItem) === -1) {
                    if (fs.lstatSync(server.getPath('node_modules/' + packageItem)).isDirectory()) {
                        var nodeModulePackagePath = server.getPath('node_modules/' + packageItem + '/package.json');
                        if (fs.existsSync(nodeModulePackagePath)) {
                            var nodeModulePackage = require(nodeModulePackagePath);

                            if (nodeModulePackage.main) {
                                var nodeModuleIndexPath = server.getPath('node_modules/' + packageItem + '/' + nodeModulePackage.main);
                                var nodeModuleIndexModule = getModule(server.getPath('node_modules/' + packageItem + '/' + nodeModulePackage.main));
                                if (nodeModuleIndexModule) {

                                    modulePaths.push('node_modules/' + packageItem + '/' + nodeModulePackage.main);
                                    app.register(nodeModuleIndexModule);

                                    moduleNames.push(packageItem);

                                }
                            }
                        }
                    }
                }
            }
        });
    }

    var mainPackageInfoPath = server.getPath('package.json');
    if (fs.existsSync(mainPackageInfoPath)) {
        var mainPackInfo = require(mainPackageInfoPath);
        if (mainPackInfo.main) {

            var module = getModule(server.getPath(mainPackInfo.main));
            if (module) {
                if (module.domain === 'core') {
                    var dbgModule = getModule(server.getPath('dbg/app/index.js'));
                    if (dbgModule) {
                        modulePaths.push('dbg/app/index.js');
                        moduleNames.push('public');
                        app.register(dbgModule);
                    }
                }
                if (module.domain === 'public') {
                    modulePaths.push(mainPackInfo.main);
                    moduleNames.push('public');
                    app.register(module);
                }
            }
        }
    }

});

gulp.task('installBowerComponents', function (done) {
    var exec = require('child_process').exec;

    var tasks = [];

    var runTasks = function () {
        var task = tasks.shift();
        if (task)
            task(runTasks);
        else {
            done();
        }
    };

    var bowerPackages = [];

    var bowerConfigs = [];

    _.each(app.modules.all, function (module) {
        if (typeof (module.getBower) === 'function') {
            var bowerConfig = module.getBower();
            bowerConfigs.push(bowerConfig);
        }
    });

    _.each(bowerConfigs, function (bowerConfig) {
        if (bowerConfig.dependencies) {
            for (var dep in bowerConfig.dependencies) {
                var packOptions = {
                    name: dep,
                    version: bowerConfig.dependencies[dep]
                };
                bowerPackages.push(packOptions);
            }
        }
    });

    _.each(bowerPackages, function (bowerPackage) {
        tasks.push(function (cb) {
            if (!fs.existsSync(server.getPath('bower_components/' + bowerPackage.name + '-' + bowerPackage.version)) && !fs.existsSync(server.getPath('bower/' + bowerPackage.name))) {
                gutil.log('bower: installing ' + bowerPackage.name + '#' + bowerPackage.version);
                exec('bower install ' + bowerPackage.name + '-' + bowerPackage.version + '=' + bowerPackage.name + '#' + bowerPackage.version
                    + ' --config.analytics=false'
                    + ' -f',
                    { cwd: './' }, function (err, stdout, stderr) {
                        if (err)
                            throw err;

                        del.sync('./bower_components/' + bowerPackage.name);
                        gutil.log('bower: installed ' + bowerPackage.name + '#' + bowerPackage.version);

                        cb();
                    });
            }
            else {
                cb();
            }
        });
    });

    runTasks();
});

gulp.task('cleanTarget', function () {

    var targets = [
        TARGET_FOLDER + '/migrations',
        TARGET_FOLDER + '/mode',
        TARGET_FOLDER + '/modules'
    ];

    if (fs.existsSync(server.getPath(TARGET_FOLDER + '/public'))) {
        var publicFolders = fs.readdirSync(server.getPath(TARGET_FOLDER + '/public'));
        var restricted = ['files', 'tmp'];
        _.each(publicFolders, function (pf) {
            if (restricted.indexOf(pf) === -1)
                targets.push(TARGET_FOLDER + '/public/' + pf);
        });
    }

    del.sync(targets);

    if (!fs.existsSync(server.getPath(TARGET_FOLDER))) {
        fs.mkdirpSync(server.getPath(TARGET_FOLDER));
        fs.mkdirpSync(server.getPath(TARGET_FOLDER + '/public'));
        fs.mkdirpSync(server.getPath(TARGET_FOLDER + '/migrations'));
    }
});

gulp.task('setMode:dev', function () {

    appMode = 'DEVELOPMENT';
    fs.writeFileSync(TARGET_FOLDER + '/mode', 'dev', {
        encoding: 'utf-8'
    });

});

gulp.task('setMode:prod', function () {

    appMode = 'PRODUCTION';
    fs.writeFileSync(TARGET_FOLDER + '/mode', 'prod', {
        encoding: 'utf-8'
    });

});

gulp.task('setModules', function () {

    var modulesText = modulePaths.join('\n');
    fs.writeFileSync(TARGET_FOLDER + '/modules', modulesText, {
        encoding: 'utf-8'
    });

});

gulp.task('copyMigrations', function () {

    var gulps = [];

    _.each(moduleNames, function (moduleName, i) {
        var modulePath = getModuleFolderPath(modulePaths[i]);

        gulps.push(gulp.src('./' + modulePath + '/dat/**')
            .pipe(gulp.dest('./' + TARGET_FOLDER + '/migrations/' + moduleName)));
    });

    return eventStream.merge(gulps);
});

var getFileCopyPublicPaths = function (module, modulePath) {
    var templatePaths = [];

    if (typeof (module.getConfig) === 'function') {
        var templates = module.getConfig().templates || [];

        templatePaths = _.union(templatePaths, ['./' + modulePath + '/web/public/**',
            '!./' + modulePath + '/web/public/files/**',
            '!./' + modulePath + '/web/public/tmp/**',
            '!./' + modulePath + '/web/public/err/**'],
            _.filter(_.map(templates, function (x) {
                if (!_.str.startsWith(x.html, '/admin/') || !_.str.startsWith(x.html, 'admin/'))
                    return '!./' + modulePath + '/web/public/' + _.str.ltrim(x.html, '/');
                else
                    '';
            }), function (f) {
                return f !== '';
            }));
    }

    return templatePaths;
}

var getFileCopyAdminPaths = function (module, modulePath) {
    var adminTemplatePaths = [];

    if (typeof (module.getConfig) === 'function') {
        var templates = module.getConfig().templates || [];

        adminTemplatePaths = _.union(adminTemplatePaths, ['./' + modulePath + '/web/admin/**',
            '!./' + modulePath + '/web/admin/err/**',
            '!./' + modulePath + '/web/admin/index.html'], _.filter(_.map(templates, function (x) {
                if (_.str.startsWith(x.html, '/admin/') || _.str.startsWith(x.html, 'admin/'))
                    return '!./' + modulePath + '/web/admin/' + _.str.ltrim(x.html, '/');
                else
                    return '';
            }), function (f) {
                return f !== '';
            }));
    }

    return adminTemplatePaths;
}

gulp.task('copyFiles', function () {

    var gulps = [];

    var templatePaths = [];
    var adminTemplatePaths = [];

    _.each(moduleNames, function (moduleName, i) {

        var module = require(server.getPath(modulePaths[i]));

        var modulePath = getModuleFolderPath(modulePaths[i]);

        templatePaths = _.union(templatePaths, getFileCopyPublicPaths(module, modulePath));
        adminTemplatePaths = _.union(adminTemplatePaths, getFileCopyAdminPaths(module, modulePath));

    });

    gulps = [
        gulp.src(templatePaths)
            .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/')),

        gulp.src(adminTemplatePaths)
           .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/admin/'))];

    return eventStream.merge(gulps);

});

gulp.task('parseTemplates', function () {

    var gulps = [];

    _.each(moduleNames, function (moduleName, i) {

        var module = require(server.getPath(modulePaths[i]));

        var modulePath = getModuleFolderPath(modulePaths[i]);

        if (typeof (module.getConfig) === 'function') {
            var templates = module.getConfig().templates || [];

            _.each(templates, function (template) {
                gulps.push(gulp.src('./' + modulePath + '/web/' + (!_.str.startsWith(template.html, '/admin/') && !_.str.startsWith(template.html, 'admin/') ? 'public/' : '') + _.str.ltrim(template.html, '/'))
                    .pipe(preprocess({ context: { NODE_ENV: appMode, DEBUG: false } }))
                    .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/' + _.str.ltrim(path.dirname(template.html), '/') + '/')));
            });

        }

        gulps.push(gulp.src('./' + modulePath + '/web/public/err/*')
            .pipe(preprocess())
            .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/err/')));

        gulps.push(gulp.src('./' + modulePath + '/web/admin/err/*')
            .pipe(preprocess())
            .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/admin/err/')));

    });

    return eventStream.merge(gulps);
});

gulp.task('generateJsnbtScript', function () {

    var script = new require('./src/app/clib/script.js')(app);
    var file = script.get();

    fs.writeFileSync(server.getPath(TARGET_FOLDER + '/public/jsnbt.js'), file, {
        encoding: 'utf8'
    });

});

gulp.task('deployBowerComponents', function () {

    var gulps = [];

    var bowerConfigs = [];

    _.each(app.modules.all, function (module) {
        if (typeof (module.getBower) === 'function') {
            var bowerConfig = module.getBower();
            bowerConfigs.push(bowerConfig);
        }
    });

    _.each(bowerConfigs, function (bowerConfig) {
        var bowerComponents = 'bower_components';
        if (bowerConfig.dependencies) {
            if (bowerConfig.deploy) {
                var bowerConfigKeys = _.keys(bowerConfig.deploy);
                _.each(bowerConfigKeys, function (deployd) {
                    var packName = deployd;
                    if (bowerConfig.dependencies[packName]) {
                        var packSpecs = bowerConfig.deploy[packName];

                        if (packSpecs.folders) {
                            _.each(packSpecs.folders, function (folderSpecs) {
                                if (folderSpecs.src && folderSpecs.dest) {
                                    folderSpecs.src = typeof (folderSpecs.src) !== 'string' ? folderSpecs.src : [folderSpecs.src];
                                    folderSpecs.dest = typeof (folderSpecs.dest) !== 'string' ? folderSpecs.dest : [folderSpecs.dest];

                                    _.each(folderSpecs.src, function (folderSpecsSrc) {
                                        _.each(folderSpecs.dest, function (folderSpecsDest) {
                                            var sourceDir = server.getPath(bowerComponents + '/' + folderSpecsSrc);
                                            var targetDir = server.getPath(TARGET_FOLDER + '/public/' + folderSpecsDest);

                                            gulps.push(gulp.src('./' + bowerComponents + '/' + folderSpecsSrc + '/**')
                                              .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/' + folderSpecsDest)));
                                        });
                                    });
                                }
                            });
                        }
                        if (packSpecs.files) {
                            _.each(packSpecs.files, function (fileSpecs) {
                                if (fileSpecs.src && fileSpecs.dest) {
                                    fileSpecs.src = typeof (fileSpecs.src) !== 'string' ? fileSpecs.src : [fileSpecs.src];
                                    fileSpecs.dest = typeof (fileSpecs.dest) !== 'string' ? fileSpecs.dest : [fileSpecs.dest];

                                    _.each(fileSpecs.src, function (fileSpecsSrc) {
                                        _.each(fileSpecs.dest, function (fileSpecsDest) {
                                            var sourceFile = server.getPath(bowerComponents + '/' + fileSpecsSrc);
                                            var targetFile = server.getPath(TARGET_FOLDER + '/public/' + fileSpecsDest);

                                            gulps.push(gulp.src('./' + bowerComponents + '/' + fileSpecsSrc)
                                              .pipe(rename(path.basename(fileSpecsDest)))
                                              .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/' + path.dirname(fileSpecsDest))));
                                        });
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
    });

    return eventStream.merge(gulps);

});

gulp.task('generateStyles', function () {

    var gulps = [];

    var bundler = require('./src/app/tmpl/bundle.js')(app);
    _.each(app.config.templates, function (tmpl) {

        if (tmpl.styles && _.isArray(tmpl.styles)) {
            var styleBundle = bundler.getStyleBundle(tmpl.styles);
            _.each(styleBundle.raw, function (r) {
                if (r.items.length > 0) {

                    var g = gulp.src(_.map(r.items, function (x, i) {
                        return './' + TARGET_FOLDER + '/public' + (_.str.startsWith(x, '/admin/') ? x : '' + x)
                    })).pipe(less({
                    }));

                    if (appMode === 'PRODUCTION') {
                        g = g.pipe(minifyCSS());
                    }

                    g = g.pipe(concat('less-files.less'))
                        .pipe(rename(path.basename(r.target)))
                        .pipe(gulp.dest('./' + TARGET_FOLDER + '/public' + path.dirname(r.target)));

                    gulps.push(g);
                }
            });
        }

    });

    return eventStream.merge(gulps);
});

gulp.task('minifyScripts', function () {

    var gulps = [];

    var targets = [];

    var bundler = require('./src/app/tmpl/bundle.js')(app);
    _.each(app.config.templates, function (tmpl) {

        if (tmpl.scripts && _.isArray(tmpl.scripts)) {
            var scriptBundle = bundler.getScriptBundle(tmpl.scripts);
            _.each(scriptBundle.raw, function (r) {
                if (r.items.length > 0 && targets.indexOf(r.target === -1)) {

                    var g = gulp.src(_.map(r.items, function (x, i) {
                        return './' + TARGET_FOLDER + '/public' + x
                    }))
                        .pipe(uglify({
                            preserveComments: false,
                            mangle: false,
                            compress: false,
                            wrap: false
                        }))
                        .pipe(concat('js-files.js'))
                        .pipe(rename(path.basename(r.target)))
                        .pipe(gulp.dest('./' + TARGET_FOLDER + '/public' + path.dirname(r.target)));

                    gulps.push(g);
                    targets.push(r.target);
                }
            });
        }

    });

    return eventStream.merge(gulps);
});

gulp.task('compressAngularTemplates', function () {

    var templateFiles = _.map(app.config.templates, function (x) {
        return '!./' + TARGET_FOLDER + '/public' + x;
    })

    return eventStream.merge([
        gulp.src(_.union(['./' + TARGET_FOLDER + '/public/admin/tmpl/**/*.html'], templateFiles))
		    .pipe(htmlmin({
		        collapseBooleanAttributes: true,
		        collapseWhitespace: true,
		        removeAttributeQuotes: true,
		        removeComments: true,
		        removeEmptyAttributes: true,
		        removeRedundantAttributes: true,
		        removeScriptTypeAttributes: true,
		        removeStyleLinkTypeAttributes: true
		    }))
		    .pipe(ngTemplates({
		        module: 'jsnbt',
		        standalone: false,
		        path: function (path, base) {
		            return 'tmpl\\' + path.replace(base, '');
		        }
		    }))
            .pipe(rename('tmpl.js'))
		    .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/admin')),

        gulp.src(_.union(['./' + TARGET_FOLDER + '/public/tmpl/**/*.html'], templateFiles))
		    .pipe(htmlmin({
		        collapseBooleanAttributes: true,
		        collapseWhitespace: true,
		        removeAttributeQuotes: true,
		        removeComments: true,
		        removeEmptyAttributes: true,
		        removeRedundantAttributes: true,
		        removeScriptTypeAttributes: true,
		        removeStyleLinkTypeAttributes: true
		    }))
		    .pipe(ngTemplates({
		        module: 'jsnbt',
		        standalone: false,
		        path: function (path, base) {
		            return 'tmpl\\' + path.replace(base, '');
		        }
		    }))
            .pipe(rename('tmpl.js'))
		    .pipe(gulp.dest('./' + TARGET_FOLDER + '/public'))
    ]);
});

function watch() {
    gutil.log('Watch enabled. Listening for file changes...');
    
    if (fs.existsSync(server.getPath('bower'))) {
        var localPackages = fs.readdirSync(server.getPath('bower'));
        _.each(localPackages, function (localPackage) {
            if (fs.lstatSync(server.getPath('bower/' + localPackage)).isDirectory()) {

                var copyFile = function (event) {

                    var searchPrefix = '\\bower\\' + localPackage + '\\';
                    var targetPath = event.path.substring(event.path.indexOf(searchPrefix) + searchPrefix.length);
                    gutil.log('File ' + event.path + ' was ' + event.type);
                    gulp.src(event.path)
                        .pipe(gulp.dest('./bower_components/' + localPackage + '/' + path.dirname(targetPath)));
                };

                var deleteFile = function (event) {
                    var searchPrefix = '\\bower\\' + localPackage + '\\';
                    var targetPath = event.path.substring(event.path.indexOf(searchPrefix) + searchPrefix.length);
                    gutil.log('File ' + event.path + ' was ' + event.type);
                    del.sync('./bower_components/' + localPackage + '/' + targetPath);
                };

                gulp.watch('./bower/' + localPackage + '/**', function (event) {
                    if (event.type === 'changed') {
                        copyFile(event);
                    }
                    else if (event.type === 'deleted') {
                        deleteFile(event);
                    }

                    runSequence('deployBowerComponents', 'generateStyles');
                });

            }
        });
    }

    if (fs.existsSync(server.getPath('npm'))) {
        var localPackages = fs.readdirSync(server.getPath('npm'));
        _.each(localPackages, function (localPackage) {
            if (fs.lstatSync(server.getPath('npm/' + localPackage)).isDirectory()) {

                var copyFile = function (event) {

                    var searchPrefix = '\\npm\\' + localPackage + '\\';
                    var targetPath = event.path.substring(event.path.indexOf(searchPrefix) + searchPrefix.length);
                    gutil.log('File ' + event.path + ' was ' + event.type);
                    gulp.src(event.path)
                        .pipe(gulp.dest('./node_modules/' + localPackage + '/' + path.dirname(targetPath)));
                };

                var deleteFile = function (event) {
                    var searchPrefix = '\\npm\\' + localPackage + '\\';
                    var targetPath = event.path.substring(event.path.indexOf(searchPrefix) + searchPrefix.length);
                    gutil.log('File ' + event.path + ' was ' + event.type);
                    del.sync('./node_modules/' + localPackage + '/' + targetPath);
                };

                gulp.watch('./npm/' + localPackage + '/**', function (event) {
                    if (event.type === 'changed') {
                        copyFile(event);
                    }
                    else if (event.type === 'deleted') {
                        deleteFile(event);
                    }
                });
            }
        });
    }

    _.each(moduleNames, function (moduleName, i) {

        var module = require(server.getPath(modulePaths[i]));

        var modulePath = getModuleFolderPath(modulePaths[i]);

        var copyFile = function (event, admin) {
            var searchPrefix = 'web\\' + admin ? 'admin' : 'public' + '\\';
            var targetPath = event.path.substring(event.path.indexOf(searchPrefix) + searchPrefix.length);
            gutil.log('File ' + event.path + ' was ' + event.type);
            gulp.src(event.path)
                .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/' + (admin ? 'admin/' : '') + path.dirname(targetPath)));
        };

        var deleteFile = function (event, admin) {
            var searchPrefix = 'web\\' + admin ? 'admin' : 'public' + '\\';
            var targetPath = event.path.substring(event.path.indexOf(searchPrefix) + searchPrefix.length);
            gutil.log('File ' + event.path + ' was ' + event.type);
            del.sync('./' + TARGET_FOLDER + '/public/' + (admin ? 'admin/' : '') + targetPath);
        };

        gulp.watch(getFileCopyAdminPaths(module, modulePath), function (event) {
            if (event.type === 'changed') {
                copyFile(event, true);
            }
            else if (event.type === 'deleted') {
                deleteFile(event, true);
            }
        });

        gulp.watch(getFileCopyPublicPaths(module, modulePath), function (event) {
            if (event.type === 'changed') {
                copyFile(event, false);
            }
            else if (event.type === 'deleted') {
                deleteFile(event, false);
            }
        });

        gulp.watch('./' + modulePath + '/cfg/**', function (event) {
            runSequence('loadModules', 'generateJsnbtScript');
        });


        var templates = module.getConfig().templates || [];

        _.each(templates, function (template) {
            gulp.watch('./' + modulePath + '/web/' + (!_.str.startsWith(template.html, '/admin/') && !_.str.startsWith(template.html, 'admin/') ? 'public/' : '') + _.str.ltrim(template.html, '/'), function (event) {
                gutil.log('File ' + event.path + ' was ' + event.type);
                gulp.src('./' + modulePath + '/web/' + (!_.str.startsWith(template.html, '/admin/') && !_.str.startsWith(template.html, 'admin/') ? 'public/' : '') + _.str.ltrim(template.html, '/'))
                    .pipe(preprocess({ context: { NODE_ENV: appMode, DEBUG: false } }))
                    .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/' + _.str.ltrim(path.dirname(template.html), '/') + '/'));
            });
        });

        gulp.watch('./' + modulePath + '/web/public/err/*', function (event) {
            gutil.log('File ' + event.path + ' was ' + event.type);
            gulp.src(event.path)
                .pipe(preprocess())
                .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/err/'));
        });

        gulp.watch('./' + modulePath + '/web/admin/err/*', function (event) {
            gutil.log('File ' + event.path + ' was ' + event.type);
            gulp.src(event.path)
                .pipe(preprocess())
                .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/admin/err/'));
        });

    });

    gulp.watch([
        './' + TARGET_FOLDER + '/public/css/**',
        './' + TARGET_FOLDER + '/public/admin/css/**'
    ], ['generateStyles']);
};

gulp.task('dev', function (callback) {

    runSequence(
        'copyLocalBowerComponents',
        'copyLocalNodeModules',
        'loadModules',
        'installBowerComponents',
        'cleanTarget',
        'setMode:dev',
        'setModules',
        'copyMigrations',
        'copyFiles',
        'parseTemplates',
        'generateJsnbtScript',
        'deployBowerComponents',
        'generateStyles',
        callback
    );

});

gulp.task('dev-update', function (callback) {

    runSequence(
        'copyLocalBowerComponents',
        'copyLocalNodeModules',
        'loadModules',
        'installBowerComponents',
        'cleanTarget',
        'setMode:dev',
        'setModules',
        'copyMigrations',
        'copyFiles',
        'parseTemplates',
        'generateJsnbtScript',
        'deployBowerComponents',
        'generateStyles',
        function () {
            watch();
        }
    );

});

gulp.task('prod', function (callback) {

    runSequence(
        'copyLocalBowerComponents',
        'copyLocalNodeModules',
        'loadModules',
        'installBowerComponents',
        'cleanTarget',
        'setMode:prod',
        'setModules',
        'copyMigrations',
        'copyFiles',
        'parseTemplates',
        'generateJsnbtScript',
        'deployBowerComponents',
        'generateStyles',
        'minifyScripts',
        'compressAngularTemplates',
        callback
    );

});