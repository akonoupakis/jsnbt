var gulp = require('gulp');
var del = require('del');
var preprocess = require('gulp-preprocess');
var less = require('gulp-less');
var rename = require("gulp-rename");
var minifyCSS = require('gulp-minify-css');
var util = require('gulp-util');
var concat = require('gulp-concat');

var fs = require('fs-extra');
var path = require('path');
var server = require('server-root');
var _ = require('underscore');

_.str = require('underscore.string');

var TARGET_FOLDER = 'www';

var app = require('./src/app/app.js');

var modulePaths = [];
var moduleNames = [];

gulp.task('copyLocalBowerComponents', function () {
    gulp.src('./bower/**')
        .pipe(gulp.dest('./bower_components'));
});

gulp.task('copyLocalNodeModules', function () {
    gulp.src('./npm/**')
        .pipe(gulp.dest('./node_modules'));
});

gulp.task('loadModules', function () {
    
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

gulp.task('installBowerComponents', function () {

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

    fs.writeFileSync(TARGET_FOLDER + '/mode', 'dev', {
        encoding: 'utf-8'
    });

});

gulp.task('setMode:prod', function () {

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

    _.each(moduleNames, function (moduleName, i) {
        var modulePath = modulePaths[i].split('/')
        modulePath.pop();
        modulePath.pop()
        modulePath = modulePath.join('/');

        gulp.src('./' + modulePath + '/dat/**')
            .pipe(gulp.dest('./' + TARGET_FOLDER + '/migrations/' + moduleName));
    });

});

gulp.task('copyFiles', function () {
    _.each(moduleNames, function (moduleName, i) {

        var module = require('./' + modulePaths[i]);

        var modulePath = modulePaths[i].split('/')
        modulePath.pop();
        modulePath.pop()
        modulePath = modulePath.join('/');

        var templatePaths = [];
        var adminTemplatePaths = [];

        if (typeof (module.getConfig) === 'function') {
            var templates = module.getConfig().templates || [];

            templatePaths = _.filter(_.map(templates, function (x) {
                if (!_.str.startsWith(x.html, '/admin/') || !_.str.startsWith(x.html, 'admin/'))
                    return '!./' + modulePath + '/web/public/' + _.str.ltrim(x.html, '/');
                else
                    '';
            }), function (f) {
                return f !== '';
            });
        
            adminTemplatePaths = _.filter(_.map(templates, function (x) {
                if (_.str.startsWith(x.html, '/admin/') || _.str.startsWith(x.html, 'admin/'))
                    return '!./' + modulePath + '/web/admin/' + _.str.ltrim(x.html, '/');
                else
                    return '';
            }), function (f) {
                return f !== '';
            });
        }
        
        gulp.src(_.union(['./' + modulePath + '/web/public/**',
            '!./' + modulePath + '/web/public/files/**',
            '!./' + modulePath + '/web/public/tmp/**',
            '!./' + modulePath + '/web/public/err/**'], templatePaths))
            .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/'));

        gulp.src(_.union(['./' + modulePath + '/web/admin/**',
            '!./' + modulePath + '/web/admin/err/**',
            '!./' + modulePath + '/web/admin/index.html'], adminTemplatePaths))
            .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/admin/'));

    });
});

gulp.task('parseTemplates', function () {

    _.each(moduleNames, function (moduleName, i) {
        
        var module = require('./' + modulePaths[i]);

        var modulePath = modulePaths[i].split('/')
        modulePath.pop();
        modulePath.pop()
        modulePath = modulePath.join('/');

        var templatePaths = [];
        var adminTemplatePaths = [];

        if (typeof (module.getConfig) === 'function') {
            var templates = module.getConfig().templates || [];
            
            // .pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: true}}))

            _.each(templates, function (template) {
                if (!_.str.startsWith(template.html, '/admin/') && !_.str.startsWith(template.html, 'admin/')) {
                    gulp.src('./' + modulePath + '/web/public/' + _.str.ltrim(template.html, '/'))
                        .pipe(preprocess())
                        .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/' + _.str.ltrim(path.dirname(template.html), '/') + '/'));
                }
                else {
                    gulp.src('./' + modulePath + '/web/' + _.str.ltrim(template.html, '/'))
                       .pipe(preprocess())
                       .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/' + _.str.ltrim(path.dirname(template.html), '/') + '/'));
                }
            });
            
        }

        gulp.src('./' + modulePath + '/web/public/err/*')
            .pipe(preprocess())
            .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/err/'));

        gulp.src('./' + modulePath + '/web/admin/err/*')
            .pipe(preprocess())
            .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/admin/err/'));
        
    });

});

gulp.task('generateJsnbtScript', function () {

    var script = new require('./src/app/clib/script.js')(app);
    var file = script.get();

    fs.writeFileSync(server.getPath(TARGET_FOLDER + '/public/jsnbt.js'), file, {
        encoding: 'utf8'
    });

});

gulp.task('deployBowerComponents', function () {
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

                                            gulp.src('./' + bowerComponents + '/' + folderSpecsSrc + '/**')
                                              .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/' + folderSpecsDest));
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

                                            gulp.src('./' + bowerComponents + '/' + fileSpecsSrc)
                                              .pipe(rename(path.basename(fileSpecsDest)))
                                              .pipe(gulp.dest('./' + TARGET_FOLDER + '/public/' + path.dirname(fileSpecsDest)));
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
});

gulp.task('generateStyles', function () {
    
    var bundler = require('./src/app/tmpl/bundle.js')(app);

    _.each(moduleNames, function (moduleName, i) {

        var module = require('./' + modulePaths[i]);

        var modulePath = modulePaths[i].split('/')
        modulePath.pop();
        modulePath.pop()
        modulePath = modulePath.join('/');

        var templatePaths = [];
        var adminTemplatePaths = [];

        if (typeof (module.getConfig) === 'function') {
            var templates = module.getConfig().templates || [];

            _.each(templates, function (tmpl) {

                if (tmpl.styles && _.isArray(tmpl.styles)) {
                    var styleBundle = bundler.getStyleBundle(tmpl.styles);
                    _.each(styleBundle.raw, function (r) {
                        if (r.items.length > 0) {

                            gulp.src(_.map(r.items, function (x) { return './' + modulePath + '/web' + x }))
                                 .pipe(less({
                                     
                                 }))
                                 .pipe(concat('less-files.less'))
                                 .pipe(rename(path.basename(r.target)))
                                 .pipe(gulp.dest('./' + TARGET_FOLDER + '/public' + path.dirname(r.target)));

                        }
                    });
                }

            });

        }
        
    });
 
});

gulp.task('dev', [
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
    'generateStyles'
]);

//gulp.task('default', ['clean', 'build', 'server'], function () {
//    gutil.log('Server started on port', gutil.colors.magenta('8000'))
//    gulp.watch('src/js/**', ['build-js'])
//    gulp.watch('src/scss/**', ['build-sass'])
//    gulp.watch('src/img/**', ['build-img'])
//    gulp.watch('src/html/**', ['build-html'])
//    //  gulp.watch(['*.html', 'view/**/*.html', 'widget/**/*.html', 'css/**/*.css', 'js/**/*.js'], {cwd: 'app'}, browserSync.reload)
//})