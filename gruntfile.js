var fs = require('fs-extra');
var path = require('path');
var server = require('server-root');
var _ = require('underscore');

_.str = require('underscore.string');

module.exports = function (grunt) {
    var self = this;

    this.app = require('./src/app/app.js');
    this.modulePaths = [];

    var getModule = function (indexPath) {
        if (fs.existsSync(indexPath)) {
            var packObject = require(indexPath);
            if (packObject && packObject.domain) {
                return packObject;
            }
        }
        return undefined;
    }

    this.moduleNames = [];

    var mainPackageInfoPath = server.getPath('package.json');
    if (fs.existsSync(mainPackageInfoPath)) {
        var mainPackInfo = require(mainPackageInfoPath);
        if (mainPackInfo.main) {

            var module = getModule(server.getPath(mainPackInfo.main));
            if (module) {
                if (module.domain === 'core') {
                    self.modulePaths.push(mainPackInfo.main);
                    self.app.register(module);
                }
            }
        }
    }

    if (fs.existsSync(server.getPath('src/pck'))) {
        var packages = fs.readdirSync(server.getPath('src/pck'));
        _.each(packages, function (packageItem) {
            if (self.moduleNames.indexOf(packageItem) === -1) {
                if (fs.lstatSync(server.getPath('src/pck/' + packageItem)).isDirectory()) {
                    if (fs.existsSync(server.getPath('node_modules/' + packageItem))) {
                        var nodeModulePackagePath = server.getPath('src/pck/' + packageItem + '/package.json');
                        if (fs.existsSync(nodeModulePackagePath)) {
                            var nodeModulePackage = require(nodeModulePackagePath);

                            if (nodeModulePackage.main) {
                                var nodeModuleIndexPath = server.getPath('src/pck/' + packageItem + '/' + nodeModulePackage.main);
                                var nodeModuleIndexModule = getModule(server.getPath('src/pck/' + packageItem + '/' + nodeModulePackage.main));
                                if (nodeModuleIndexModule) {
                                    self.modulePaths.push('node_modules/' + packageItem + '/' + nodeModulePackage.main);
                                    self.app.register(nodeModuleIndexModule);

                                    self.moduleNames.push(packageItem);
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    if (fs.existsSync(server.getPath('node_modules'))) {
        var packages = fs.readdirSync(server.getPath('node_modules'));
        _.each(packages, function (packageItem) {

            if (_.str.startsWith(packageItem, 'jsnbt')) {
                if (self.moduleNames.indexOf(packageItem) === -1) {
                    if (fs.lstatSync(server.getPath('node_modules/' + packageItem)).isDirectory()) {
                        var nodeModulePackagePath = server.getPath('node_modules/' + packageItem + '/package.json');
                        if (fs.existsSync(nodeModulePackagePath)) {
                            var nodeModulePackage = require(nodeModulePackagePath);

                            if (nodeModulePackage.main) {
                                var nodeModuleIndexPath = server.getPath('node_modules/' + packageItem + '/' + nodeModulePackage.main);
                                var nodeModuleIndexModule = getModule(server.getPath('node_modules/' + packageItem + '/' + nodeModulePackage.main));
                                if (nodeModuleIndexModule) {

                                    self.modulePaths.push('node_modules/' + packageItem + '/' + nodeModulePackage.main);
                                    self.app.register(nodeModuleIndexModule);

                                    self.moduleNames.push(packageItem);

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
                        self.modulePaths.push('dbg/app/index.js');
                        self.app.register(dbgModule);
                    }
                }
                if (module.domain === 'public') {
                    self.modulePaths.push(mainPackInfo.main);
                    self.app.register(module);
                }
            }
        }
    }

    var getFilesToClean = function (folder) {
        var results = [];

        var folderPath = server.getPath(folder);
        if (fs.existsSync(folderPath)) {
            var rootItems = fs.readdirSync(folderPath);
            _.each(rootItems, function (rootItem) {
                if (rootItem === 'public') {
                    var publicItems = fs.readdirSync(path.join(folderPath, rootItem));
                    _.each(publicItems, function (publicItem) {
                        if (publicItem !== 'files') {
                            results.push(path.join(folder, rootItem, publicItem));
                        }
                    });
                }
                else {
                    results.push(path.join(folder, rootItem));
                }
            });
        }

        return results;
    };

    var getFilesToCopy = function (folder) {

        var publicCopyfiles = ['img/**', 'js/**', 'font/**', 'css/**', 'tmpl/**', 'err/**', 'tmp/', 'files/'];
        _.each(self.app.config.fileGroups, function (fileGroup) {
            publicCopyfiles.push('files/' + fileGroup + '/');
        });

        var files = [{
            expand: true,
            cwd: 'src/dat/',
            src: ['**'],
            dest: folder + '/migrations/' + mainPackInfo.name
        },
		{
		    expand: true,
		    cwd: 'src/web/public/',
		    src: publicCopyfiles,
		    dest: folder + '/public/'
		},
		{
		    expand: true,
		    cwd: 'src/web/admin/',
		    src: ['img/**', 'js/**', 'font/**', 'css/**', 'tmpl/**', 'err/**'],
		    dest: folder + '/public/admin/'
		}, {
		    expand: true,
		    cwd: 'dbg/dat/',
		    src: ['**'],
		    dest: folder + '/migrations/' + mainPackInfo.name
		},
		{
		    expand: true,
		    cwd: 'dbg/web/public/',
		    src: publicCopyfiles,
		    dest: folder + '/public/'
		},
		{
		    expand: true,
		    cwd: 'dbg/web/admin/',
		    src: ['img/**', 'js/**', 'font/**', 'css/**', 'tmpl/**', 'err/**'],
		    dest: folder + '/public/admin/'
		}];

        return files;
    };

    var getFilesToPreprocess = function (folder, site) {
        var results = [];

        var files = [];

        var addFile = function (internalFilePath) {
            if (fs.existsSync(server.getPath(internalFilePath))) {
                files.push(internalFilePath);
            }
        };

        var addPath = function (internalPath) {
            if (fs.existsSync(server.getPath(internalPath))) {
                var pathFiles = fs.readdirSync(server.getPath(internalPath));
                _.each(pathFiles, function (packFile) {
                    addFile(internalPath + '/' + packFile);
                });
            }
        };

        if (site === undefined || site === 'admin') {
            addPath('src/web/admin/err');
            addFile('src/web/admin/index.html');
        }

        if (site === undefined || site === 'public') {
            addPath('src/web/public/err');

            _.each(self.app.config.templates, function (tmpl) {
                addFile('src/web/public/' + _.str.ltrim(tmpl.html, '/'));
            });

        }

        if (fs.existsSync(server.getPath('src/pck'))) {
            var packages = fs.readdirSync(server.getPath('src/pck'));
            _.each(packages, function (packageItem) {

                if (fs.lstatSync(server.getPath('src/pck/' + packageItem)).isDirectory()) {
                    if (site === undefined || site === 'admin') {
                        addPath('src/pck/' + packageItem + '/web/admin/err');
                        addFile('src/pck/' + packageItem + '/web/admin/index.html');
                    }

                    if (site === undefined || site === 'public') {
                        addPath('src/pck/' + packageItem + '/web/public/err');
                    }
                }
            });
        }

        var denormalize = function (text) {
            return text.replace(/\\/g, '/');
        };

        _.each(files, function (pathItem) {
            var destPath = null;

            if (pathItem.indexOf('web/admin/') !== -1) {
                destPath = 'admin/' + pathItem.substring(pathItem.indexOf('web/admin/') + 'web/admin/'.length);
            }
            else if (pathItem.indexOf('web/public/') !== -1) {
                destPath = pathItem.substring(pathItem.indexOf('web/public/') + 'web/public/'.length);
            }

            if (destPath !== null) {
                results.push({
                    src: './' + denormalize(pathItem),
                    dest: './' + denormalize(path.join(folder, '/', 'public', '/', destPath))
                });
            }
        });

        return results;
    };

    var getFilesToLess = function (folder, site) {

        fs.emptyDirSync('./' + folder + '/public/tmp/styles');

        var results = [];

        var bundler = require('./src/app/tmpl/bundle.js')(self.app);

        _.each(self.app.config.templates, function (tmpl) {
            if (tmpl.styles && _.isArray(tmpl.styles)) {
                var styleBundle = bundler.getStyleBundle(tmpl.styles);
                _.each(styleBundle.raw, function (r) {
                    if (r.items.length > 0) {
                        results.push({
                            src: _.map(r.items, function (x) { return './' + folder + '/public' + x }),
                            dest: './' + folder + '/public' + r.target
                        });
                    }
                });
            }
        });

        return results;
    };

    var getLessPaths = function (folder) {
        return [
			'./' + folder + '/public/css/',
			'./' + folder + '/public/admin/css/',
			'./bower_components'
        ];
    };

    getFilesToUglify = function (folder) {

        fs.emptyDirSync('./' + folder + '/public/tmp/scripts');

        var results = [];

        var bundler = require('./src/app/tmpl/bundle.js')(self.app);

        _.each(self.app.config.templates, function (tmpl) {
            if (tmpl.scripts && _.isArray(tmpl.scripts)) {
                var scriptBundle = bundler.getScriptBundle(tmpl.scripts);
                _.each(scriptBundle.raw, function (r) {
                    if (r.items.length > 0) {
                        results.push({
                            src: _.map(r.items, function (x) { return './' + folder + '/public' + x }),
                            dest: './' + folder + '/public' + r.target
                        });
                    }
                });
            }
        });

        return results;
    };

    var deployFiles = function (source, target) {
        if (!fs.existsSync(target)) {
            fs.mkdirpSync(target);
        }

        fs.copySync(source, target);
        diffLessFile(source + '/css/_.less', target + '/css/_.less');
    };

    var diffLessFile = function (source, target) {
        if (fs.existsSync(source)) {
            if (fs.existsSync(target)) {
                var sourceLines = fs.readFileSync(source, 'utf-8').split('\n');
                var targetLines = fs.readFileSync(target, 'utf-8').split('\n');
                var changed = false;

                for (var i = 0; i < sourceLines.length; i++) {
                    if (targetLines.indexOf(sourceLines[i]) == -1) {
                        targetLines.push(sourceLines[i]);
                        changed = true;
                    }
                }

                if (changed) {
                    fs.writeFileSync(target, targetLines.join('\n'), 'utf-8');
                }
            }
        }
    };

    grunt.registerMultiTask('mod', 'Install & pack modules', function () {
        var runFn = function (mod) {
            var modMngr = require('./installer.js');
            if (fs.existsSync(server.getPath(mod))) {

                var installOne = function (moduleName) {
                    if (fs.lstatSync(server.getPath(path.join(mod, moduleName))).isDirectory()) {
                        modMngr[mod].install(moduleName, true);
                        grunt.log.ok('Module ' + moduleName + ' installed');
                    }
                };

                var installAll = function () {
                    var found = fs.readdirSync(server.getPath(mod));
                    _.each(found, function (f) {
                        installOne(f);
                    });
                };

                var modulesFilePath = path.join(server.getPath(mod), 'modules');
                if (fs.existsSync(modulesFilePath)) {
                    if (!fs.lstatSync(modulesFilePath).isDirectory()) {
                        var fileModuleNames = _.map(fs.readFileSync(modulesFilePath, 'utf-8').split('\n'), function (x) {
                            return _.str.trim(x);
                        });

                        _.each(fileModuleNames, function (fileModuleName) {
                            installOne(fileModuleName);
                        });
                    }
                    else {
                        installAll();
                    }
                }
                else {
                    installAll();
                }
            }
        };

        runFn(this.target);
    });

    grunt.registerMultiTask('script', 'Creates the precompiled jsnbt script', function () {

        var script = new require('./src/app/clib/script.js')(self.app);
        var file = script.get();

        fs.writeFileSync(server.getPath('www/public/jsnbt.js'), file, {
            encoding: 'utf8'
        });

    });

    grunt.registerMultiTask('patch', 'Patch the copied with the package files', function () {

        if (fs.existsSync(server.getPath('src/pck'))) {
            var found = fs.readdirSync(server.getPath('src/pck'));
            _.each(found, function (f) {

                if (fs.existsSync(server.getPath('src/pck/' + f + '/web/public'))) {
                    deployFiles(server.getPath('src/pck/' + f + '/web/public'), server.getPath('www/public'));
                }

                if (fs.existsSync(server.getPath('src/pck/' + f + '/web/admin'))) {
                    deployFiles(server.getPath('src/pck/' + f + '/web/admin'), server.getPath('www/public/admin'));
                }

                if (fs.existsSync(server.getPath('src/pck/' + f + '/dat'))) {
                    deployFiles(server.getPath('src/pck/' + f + '/dat'), server.getPath('www/migrations/' + f));
                }
            });
        }
    });

    grunt.registerMultiTask('cleanempty', 'Clean empty folders', function () {

        function cleanFolder(folder, recursive) {
            if (fs.existsSync(folder)) {
                if (fs.lstatSync(folder).isDirectory()) {
                    var children = fs.readdirSync(folder);
                    if (children.length === 0) {
                        fs.rmdirSync(folder);
                    }
                    else {
                        if (recursive) {
                            children.forEach(function (childItemName) {
                                if (fs.lstatSync(folder + '/' + childItemName).isDirectory()) {
                                    cleanFolder(folder + '/' + childItemName, recursive);
                                }
                            });
                        }

                        children = fs.readdirSync(folder);
                        if (children.length === 0) {
                            fs.rmdirSync(folder);
                        }
                    }
                }
            }
        }

        _.each(this.data.src, function (item) {

            if (fs.existsSync(item)) {
                if (fs.lstatSync(item).isDirectory()) {
                    cleanFolder(item, true);
                }
            }
        });

    });

    grunt.registerMultiTask('setenv', 'Setting environment', function () {

        fs.writeFileSync('www/mode', this.target, {
            encoding: 'utf-8'
        });

    });

    grunt.registerMultiTask('setmod', 'Setting environment', function () {

        var modulesText = self.modulePaths.join('\n');
        fs.writeFileSync('www/modules', modulesText, {
            encoding: 'utf-8'
        });

    });

    grunt.registerMultiTask('bower', 'Install bower components', function () {

        var exec = require('child_process').exec;

        var tasks = [];

        var done = this.async();

        var add = function (successMessage, bowerPackage) {
            tasks.push(function (cb) {
                if (!fs.existsSync(server.getPath('bower_components/' + bowerPackage.name + '-' + bowerPackage.version))) {
                    exec('bower install ' + bowerPackage.name + '-' + bowerPackage.version + '=' + bowerPackage.name + '#' + bowerPackage.version
                        + ' --config.analytics=false'
                        + ' -f',
                        { cwd: './' }, function (err, stdout, stderr) {
                            if (err)
                                throw err;

                            grunt.log.ok(successMessage);
                            cb();
                        });
                }
                else {
                    cb();
                }
            });
        };

        var runTasks = function () {
            var task = tasks.shift();
            if (task)
                task(runTasks);
            else
                done();
        };

        var bowerPackages = [];

        var bowerConfigs = [];

        var packageNames = [];

        _.each(self.app.modules.all, function (module) {
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
            add('installed bower package ' + bowerPackage.name + ' v' + bowerPackage.version, bowerPackage);
        });

        runTasks();
    });

    grunt.registerMultiTask('deploybower', 'Deploy bower components', function () {
        var folder = 'www';

        var bowerConfigs = [];

        _.each(self.app.modules.all, function (module) {
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
                                                var targetDir = server.getPath(folder + '/public/' + folderSpecsDest);

                                                if (fs.existsSync(sourceDir)) {
                                                    if (!fs.existsSync(targetDir))
                                                        fs.mkdirpSync(targetDir);

                                                    fs.copySync(sourceDir, targetDir);
                                                }
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
                                                var targetFile = server.getPath(folder + '/public/' + fileSpecsDest);

                                                if (fs.existsSync(sourceFile)) {
                                                    var sourceFileName = path.basename(sourceFile);

                                                    var targetFolder = targetFile.substring(0, targetFile.lastIndexOf('/'));

                                                    if (!fs.existsSync(targetFolder))
                                                        fs.mkdirpSync(targetFolder);

                                                    fs.copySync(sourceFile, targetFile);
                                                }
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

    var gruntConfig = {};

    fs.mkdirpSync('./src');
    fs.mkdirpSync('./src/app');
    fs.mkdirpSync('./src/cfg');
    fs.mkdirpSync('./src/dat');
    fs.mkdirpSync('./src/pck');
    fs.mkdirpSync('./src/web');
    fs.mkdirpSync('./src/web/public');
    fs.mkdirpSync('./src/web/public/css');
    fs.mkdirpSync('./src/web/public/err');
    fs.mkdirpSync('./src/web/public/files');

    _.each(self.app.config.fileGroups, function (fileGroup) {
        fs.mkdirpSync('./src/web/public/files/' + fileGroup);
    });

    fs.mkdirpSync('./src/web/public/img');
    fs.mkdirpSync('./src/web/public/js');
    fs.mkdirpSync('./src/web/public/tmp');
    fs.mkdirpSync('./src/web/public/tmpl');

    gruntConfig.pkg = grunt.file.readJSON('package.json');

    gruntConfig.mod = {
        bower: {
            force: true
        },
        npm: {
            force: true
        }
    };

    gruntConfig.bower = {
        dev: {},
        prod: {}
    };

    gruntConfig.jshint = {
        files: ['src/app/**', 'src/web/admin/js/**', 'src/web/public/js/**'],
        options: {
            globals: {
                jQuery: true,
                console: true,
                module: true,
                document: true,
                angular: true
            }
        }
    };

    gruntConfig.env = {
        options: {},
        dev: {
            NODE_ENV: 'DEVELOPMENT'
        },
        prod: {
            NODE_ENV: 'PRODUCTION'
        }
    };

    gruntConfig.clean = {
        dev: {
            options: {
                force: true
            },
            src: getFilesToClean('www')
        },
        prod: {
            options: {
                force: true
            },
            src: getFilesToClean('www')
        },
        devLess: [
            "www/public/admin/css/**/*.less",
            "www/public/admin/css/*.less",
            "www/public/css/**/*.less",
            "www/public/css/*.less"
        ],
        prodLess: [
            "www/public/admin/css/**/*.less",
            "www/public/admin/css/*.less",
            "www/public/css/**/*.less",
            "www/public/css/*.less"
        ],
        prodMinified: [
            "www/public/admin/css/*.css",
            "!www/public/admin/css/*.min.css",
            "www/public/css/*.css",
            "!www/public/css/*.min.css"
        ],
        prodUglified: [
            "www/public/admin/js/**/*.js",
            "www/public/admin/js/*.js",
            "!www/public/admin/js/*.min.js",
            "www/public/js/app",
            "www/public/js/lib",
            "www/public/js/*.js",
            "!www/public/js/*.min.js",
        ]
    };

    gruntConfig.copy = {
        devAdminJs: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/admin/',
                src: ['js/**'],
                dest: 'www/public/admin/'
            }]
        },
        devAdminImg: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/admin/',
                src: ['img/**'],
                dest: 'www/public/admin/'
            }]
        },
        devAdminTmpl: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/admin/tmpl/',
                src: ['**'],
                dest: 'www/public/admin/tmpl/'
            }]
        },
        devAdminCss: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/admin/css/',
                src: ['**'],
                dest: 'www/public/admin/css/'
            }]
        },
        devPublicJs: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/public/',
                src: ['js/**'],
                dest: 'www/public/'
            }]
        },
        devPublicImg: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/public/',
                src: ['img/**'],
                dest: 'www/public/'
            }]
        },
        devPublicTmpl: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/public/tmpl/',
                src: ['**'],
                dest: 'www/public/tmpl/'
            }]
        },
        devPublicCss: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/public/css/',
                src: ['**'],
                dest: 'www/public/css/'
            }]
        },
        dev: {
            files: getFilesToCopy('www')
        },
        prod: {
            files: getFilesToCopy('www')
        }
    };

    gruntConfig.script = {
        dev: {},
        prod: {}
    };

    gruntConfig.patch = {
        dev: {},
        prod: {}
    };

    gruntConfig.deploybower = {
        dev: {},
        prod: {}
    };

    gruntConfig.less = {
        devPublic: {
            options: {
                concat: false,
                paths: getLessPaths('www')
            },
            files: getFilesToLess('www', 'public')
        },
        devAdmin: {
            options: {
                concat: false,
                paths: getLessPaths('www')
            },
            files: getFilesToLess('www', 'admin')
        },
        dev: {
            options: {
                concat: false,
                paths: getLessPaths('www')
            },
            files: getFilesToLess('www')
        },
        prod: {
            options: {
                concat: false,
                paths: getLessPaths('www')
            },
            files: getFilesToLess('www')
        }
    };

    gruntConfig.preprocess = {
        devPublic: {
            files: getFilesToPreprocess('www', 'public')
        },
        devAdmin: {
            files: getFilesToPreprocess('www', 'admin')
        },
        dev: {
            files: getFilesToPreprocess('www')
        },
        prod: {
            files: getFilesToPreprocess('www')
        }
    };

    gruntConfig.cssmin = {
        prod: {
            files: [{
                src: './www/public/admin/css/style.css',
                dest: './www/public/admin/css/style.min.css'
            }, {
                src: './www/public/css/style.css',
                dest: './www/public/css/style.min.css'
            }]
        }
    };

    gruntConfig.uglify = {
        prod: {
            options: {
                preserveComments: false,
                mangle: false,
                compress: false,
                wrap: false
            },
            files: getFilesToUglify('www')
        }
    };

    gruntConfig.cleanempty = {
        dev: {
            src: [
                'www/public/admin/js/',
                'www/public/admin/css/',
                'www/public/js/',
                'www/public/css/'
            ]
        },
        prod: {
            src: [
                'www/public/admin/js/',
                'www/public/admin/css/',
                'www/public/js/',
                'www/public/css/'
            ]
        }
    };

    gruntConfig.setenv = {
        dev: {},
        prod: {}
    };

    gruntConfig.setmod = {
        dev: {},
        prod: {}
    };

    gruntConfig.watch = {
        adminCss: {
            files: 'src/web/admin/css/**',
            tasks: ['less:devAdmin']
        },
        adminJs: {
            files: 'src/web/admin/js/**',
            tasks: ['copy:devAdminJs']
        },
        adminImg: {
            files: 'src/web/admin/img/**',
            tasks: ['copy:devAdminImg']
        },
        adminTmpl: {
            files: ['src/web/admin/err/**', 'src/web/admin/tmpl/**'],
            tasks: ['preprocess:devAdmin']
        },
        adminFiles: {
            files: ['src/web/admin/**'],
            tasks: ['copy:devAdminJs', 'copy:devAdminImg', 'copy:devAdminTmpl', 'preprocess:devAdmin']
        },
        adminAll: {
            files: ['src/web/admin/**', 'src/web/public/**'],
            tasks: ['copy:devAdminJs', 'copy:devAdminImg', 'copy:devAdminTmpl', 'copy:devAdminCss', 'preprocess:devAdmin', 'less:devAdmin', 'clean:devLess', 'cleanempty:dev']
        },

        publicCss: {
            files: 'src/web/public/css/**',
            tasks: ['less:devPublic']
        },
        publicJs: {
            files: 'src/web/public/js/**',
            tasks: ['copy:devPublicJs']
        },
        publicImg: {
            files: 'src/web/public/img/**',
            tasks: ['copy:devPublicImg']
        },
        publicTmpl: {
            files: ['src/web/public/err/**', 'src/web/public/tmpl/**'],
            tasks: ['preprocess:devPublic']
        },
        publicFiles: {
            files: ['src/web/public/**'],
            tasks: ['copy:devPublicJs', 'copy:devPublicImg', 'copy:devPublicTmpl', 'preprocess:devPublic']
        },
        publicAll: {
            files: ['src/web/public/**'],
            tasks: ['copy:devPublicJs', 'copy:devPublicImg', 'copy:devPublicTmpl', 'copy:devPublicCss', 'preprocess:devPublic', 'less:devPublic', 'clean:devLess', 'cleanempty:dev']
        },
        dev: {
            files: [
                'src/web/admin/js/**', 'src/web/admin/css/**', 'src/web/admin/tmpl/**',
                'src/web/public/js/**', 'src/web/public/css/**', 'src/web/public/tmpl/**'
            ],
            tasks: [
                //'jshint',
                'copy:devAdminJs', 'copy:devAdminImg', 'copy:devAdminTmpl', 'copy:devAdminCss', 'less:devAdmin', 'preprocess:devAdmin',
                'copy:devPublicJs', 'copy:devPublicImg', 'copy:devPublicTmpl', 'copy:devPublicCss', 'preprocess:devPublic', 'less:devPublic'
            ]
        }
    };

    grunt.initConfig(gruntConfig);

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-preprocess');


    grunt.registerTask('default', ['jshint']);


    // 'jshint'
    grunt.registerTask('dev', ['mod:bower', 'mod:npm', 'bower:dev', 'env:dev', 'clean:dev', 'setenv:dev', 'setmod:dev', 'copy:dev', 'script:dev', 'patch:dev', 'deploybower:dev', 'less:dev', 'preprocess:dev']);
    grunt.registerTask('prod', ['mod:bower', 'mod:npm', 'bower:prod', 'env:prod', 'clean:prod', 'setenv:prod', 'setmod:prod', 'copy:prod', 'script:prod', 'patch:prod', 'deploybower:prod', 'less:prod', 'preprocess:prod', 'clean:prodLess', 'cssmin:prod', 'clean:prodMinified', 'uglify:prod', 'cleanempty:prod']);

    grunt.registerTask('watch-public-css', ['watch:publicCss']);
    grunt.registerTask('watch-public-js', ['watch:publicJs']);
    grunt.registerTask('watch-public-img', ['watch:publicImg']);
    grunt.registerTask('watch-public-tmpl', ['watch:publicTmpl']);
    grunt.registerTask('watch-public-files', ['watch:publicFiles']);
    grunt.registerTask('watch-public', ['watch:publicAll']);

    grunt.registerTask('watch-admin-css', ['watch:adminCss']);
    grunt.registerTask('watch-admin-js', ['watch:adminJs']);
    grunt.registerTask('watch-admin-img', ['watch:adminImg']);
    grunt.registerTask('watch-admin-tmpl', ['watch:adminTmpl']);
    grunt.registerTask('watch-admin-files', ['watch:adminFiles']);
    grunt.registerTask('watch-admin', ['watch:adminAll']);

    grunt.registerTask('update-files', ['watch:dev']);
};