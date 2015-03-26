var fs = require('./util/fs.js');
var jsnbt = require('./jsnbt.js');
var pack = require('./package.js');
var path = require('path');
var bower = require('bower');
var async = require('async');
var server = require('server-root');
var _ = require('underscore');

_.str = require('underscore.string');

module.exports = function (grunt) {

    var self = this;

    this.modules = [];
    
    var registerJsnbtConfig = function (indexPath) {
        if (fs.existsSync(indexPath)) {
            var packObject = require(indexPath);
            if (packObject) {
                var moduleConfig = typeof (packObject.getConfig) === 'function' ? packObject.getConfig() : {};

                if (moduleConfig.domain)
                    jsnbt.register(moduleConfig.domain, packObject);

                packObject.domain = moduleConfig.domain;
                packObject.public = moduleConfig.public;

                self.modules.push(packObject);
            }
        }
    }

    var packInfoPath = server.getPath('package.json');
    if (fs.existsSync(packInfoPath)) {
        var packInfo = require(packInfoPath);
        if (packInfo.main) {
            registerJsnbtConfig(server.getPath(packInfo.main))
        }
    }

    registerJsnbtConfig(server.getPath('src/app/dbg/index.js'));

    this.moduleNames = [];

    if (fs.existsSync(server.getPath('src/pck'))) {
        var packages = fs.readdirSync(server.getPath('src/pck'));
        _.each(packages, function (packageItem) {
            
            if (self.moduleNames.indexOf(packageItem) === -1) {
                if (fs.lstatSync(server.getPath('src/pck/' + packageItem)).isDirectory()) {
                    var nodeModulePackagePath = server.getPath('src/pck/' + packageItem + '/package.json');
                    if (fs.existsSync(nodeModulePackagePath)) {
                        var nodeModulePackage = require(nodeModulePackagePath);

                        if (nodeModulePackage.main) {
                            var nodeModuleIndexPath = server.getPath('src/pck/' + packageItem + '/' + nodeModulePackage.main);
                            registerJsnbtConfig(nodeModuleIndexPath);
                        }
                    }
                }

                self.moduleNames.push(packageItem);
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
                                registerJsnbtConfig(nodeModuleIndexPath);
                            }
                        }
                    }

                    self.moduleNames.push(packageItem);
                }
            }
        });
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
                            results.push(path.join('dev', rootItem, publicItem));
                        }
                    });
                }
                else {
                    results.push(path.join('dev', rootItem));
                }
            });
        }

        return results;
    };
    
    var getFilesToCopy = function (folder) {
        
        var publicCopyfiles = ['img/**', 'js/**', 'font/**', 'css/**', 'tmpl/**', 'error/**', 'tmp/', 'files/'];
        _.each(jsnbt.fileGroups, function (fileGroup) {
            publicCopyfiles.push('files/' + fileGroup + '/');
        });

        var files = [{
            expand: true,
            cwd: 'src/dpd/',
            src: ['app.dpd', 'node_modules/**', 'resources/**'],
            dest: folder + '/'
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
		    src: ['img/**', 'js/**', 'font/**', 'css/**', 'tmpl/**', 'error/**'],
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
            addPath('src/web/admin/error');
            addFile('src/web/admin/index.html');
        }

        if (site === undefined || site === 'public') {
            addPath('src/web/public/error');

            _.each(jsnbt.templates, function (tmpl) {
                addFile('src/web/public/' + _.str.ltrim(tmpl.html, '/'));
            });
            
        }

        if (fs.existsSync(server.getPath('src/pck'))) {
            var packages = fs.readdirSync(server.getPath('src/pck'));
            _.each(packages, function (packageItem) {

                if (fs.lstatSync(server.getPath('src/pck/' + packageItem)).isDirectory()) {
                    if (site === undefined || site === 'admin') {
                        addPath('src/pck/' + packageItem + '/web/admin/error');
                        addFile('src/pck/' + packageItem + '/web/admin/index.html');
                    }

                    if (site === undefined || site === 'public') {
                        addPath('src/pck/' + packageItem + '/web/public/error');
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
        var files = [];

        if (site === undefined || site === 'admin') {
            files.push({
                src: folder + '/public/admin/css/**/*.less',
                dest: folder + '/public/admin/css/style.css'
            });
        }
        if (site === undefined || site === 'public') {
            files.push({
                src: folder + '/public/css/*.less',
                dest: folder + '/public/css/style.css'
            });
        }

        return files;
    };

    var getLessPaths = function (folder) {
        return [
			'./' + folder + '/public/css/',
			'./' + folder + '/public/admin/css/',
			'./bower_components'
        ];
    };
    
    getFilesToUglify = function (folder) {

        var adminLibPaths = [];
        var adminAppPaths = [];

        var appendJsFiles = function (domain) {
            adminLibPaths.push('./' + folder + '/public/admin/js/' + domain + '/lib/*.js');
            adminLibPaths.push('./' + folder + '/public/admin/js/' + domain + '/lib/**/**.js');
            adminLibPaths.push('./' + folder + '/public/admin/js/' + domain + '/lib/**/**/**.js');

            adminAppPaths.push('./' + folder + '/public/admin/js/' + domain + '/app/*.js');
            adminAppPaths.push('./' + folder + '/public/admin/js/' + domain + '/app/**/**.js');
            adminAppPaths.push('./' + folder + '/public/admin/js/' + domain + '/app/**/**/**.js');
        }

        appendJsFiles('core');

        _.each(self.modules, function (module) {
            if (module.domain !== 'core') {
                appendJsFiles(module.domain);
            }
        });

        return [{
            src: adminLibPaths, 
            dest: './' + folder + '/public/admin/js/lib.min.js'
        }, {
            src: adminAppPaths, 
            dest: './' + folder + '/public/admin/js/app.min.js'
        }, {
            src: ['./' + folder + '/public/admin/js/init.js'],
            dest: './' + folder + '/public/admin/js/init.min.js'
        },
		{
		    src: [
                './' + folder + '/public/js/lib/*.js',
                './' + folder + '/public/js/lib/**/**.js',
                './' + folder + '/public/js/lib/**/**/**.js'
		    ],
		    dest: './' + folder + '/public/js/lib.min.js'
		}, {
		    src: [
                './' + folder + '/public/js/app/main.js',
                './' + folder + '/public/js/app/**/**.js',
                './' + folder + '/public/js/app/**/**/**.js'
		    ],
		    dest: './' + folder + '/public/js/app.min.js'
		}, {
		    src: ['./' + folder + '/public/js/init.js'],
		    dest: './' + folder + '/public/js/init.min.js'
		}];
    };

    grunt.registerMultiTask('mod', 'Install & pack modules', function () {
        var runFn = function (mod) {
            if (fs.existsSync(server.getPath(mod))) {                
                var found = fs.readdirSync(server.getPath(mod));
                _.each(found, function (f) {
                    pack[mod].install(f, true);
                });
            }
        };

        runFn(this.target);
    });

    grunt.registerMultiTask('patch', 'Patch the copied with the package files', function () {

        var folder = this.target == 'prod' ? 'dist' : 'dev';
        
        if (fs.existsSync(server.getPath('src/pck'))) {
            var found = fs.readdirSync(server.getPath('src/pck'));
            _.each(found, function (f) {
                pack.npm.deploy(f, folder);
            });
        }
    });

    grunt.registerMultiTask('cleanempty', 'Clean empty folders', function () {

        var folder = this.target == 'prod' ? 'dist' : 'dev';

        _.each(this.data.src, function (item) {
            fs.clean(item, true);
        });

    });

    grunt.registerMultiTask('bower', 'Install bower components', function () {

        var exec = require('child_process').exec;

        var tasks = [];

        var done = this.async();

        var add = function (successMessage, bowerPackage) {
            tasks.push(function (cb) {
                exec('bower install ' + bowerPackage.name + '-' + bowerPackage.version + '=' + bowerPackage.name + '#' + bowerPackage.version
                    // + ' --config.directory=bower_components'
                    + ' --config.analytics=false',
                    { cwd: './' }, function (err, stdout, stderr) {
                    if (err)
                        throw err;

                    //grunt.log.ok(stdout);

                    grunt.log.ok(successMessage);
                    cb();
                });
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

        _.each(self.modules, function (module) {
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
                    if (!fs.existsSync(server.getPath('bower_components/' + packOptions.name + '-' + packOptions.version))) {
                        bowerPackages.push(packOptions);
                    }
                }
            }
        });

        _.each(bowerPackages, function (bowerPackage) {
            add('installed bower package ' + bowerPackage.name + ' v' + bowerPackage.version, bowerPackage);
        });

        runTasks();
    });

    grunt.registerMultiTask('deploybower', 'Deploy bower components', function () {
        var folder = this.target == 'prod' ? 'dist' : 'dev';
        
        var bowerConfigs = [];

        _.each(self.modules, function (module) {
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
                                                        fs.create(targetDir);

                                                    fs.copy(sourceDir, targetDir, true);
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
                                                        fs.create(targetFolder);

                                                    fs.copy(sourceFile, targetFile, true);
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

    fs.create('./src');
    fs.create('./src/app');
    fs.create('./src/dpd');
    fs.create('./src/pck');
    fs.create('./src/web');
    fs.create('./src/web/public');
    fs.create('./src/web/public/css');
    fs.create('./src/web/public/error');
    fs.create('./src/web/public/files');
    fs.create('./src/web/public/img');
    fs.create('./src/web/public/js');
    fs.create('./src/web/public/tmp');
    fs.create('./src/web/public/tmpl');

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
            src: getFilesToClean('dev')
        },
        prod: {
            options: {
                force: true
            },
            src: getFilesToClean('dist')
        },
        devLess: [
            "dev/public/admin/css/**/*.less",
            "dev/public/admin/css/*.less",
            "dev/public/css/**/*.less",
            "dev/public/css/*.less"
        ],
        prodLess: [
            "dist/public/admin/css/**/*.less",
            "dist/public/admin/css/*.less",
            "dist/public/css/**/*.less",
            "dist/public/css/*.less"
        ],
        prodMinified: [
            "dist/public/admin/css/*.css",
            "!dist/public/admin/css/*.min.css",
            "dist/public/css/*.css",
            "!dist/public/css/*.min.css"
        ],
        prodUglified: [
            "dist/public/admin/js/**/*.js",
            "dist/public/admin/js/*.js",
            "!dist/public/admin/js/*.min.js",
            "dist/public/js/app",
            "dist/public/js/lib",
            "dist/public/js/*.js",
            "!dist/public/js/*.min.js",
        ]
    };

    gruntConfig.copy = {
        devAdminJs: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/admin/',
                src: ['js/**'],
                dest: 'dev/public/admin/'
            }]
        },
        devAdminImg: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/admin/',
                src: ['img/**'],
                dest: 'dev/public/admin/'
            }]
        },
        devAdminTmpl: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/admin/tmpl/',
                src: ['**'],
                dest: 'dev/public/admin/tmpl/'
            }]
        },
        devAdminCss: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/admin/css/',
                src: ['**'],
                dest: 'dev/public/admin/css/'
            }]
        },
        devPublicJs: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/public/',
                src: ['js/**'],
                dest: 'dev/public/'
            }]
        },
        devPublicImg: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/public/',
                src: ['img/**'],
                dest: 'dev/public/'
            }]
        },
        devPublicTmpl: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/public/tmpl/',
                src: ['**'],
                dest: 'dev/public/tmpl/'
            }]
        },
        devPublicCss: {
            files: [{
                expand: true,
                onlyIf: 'newer',
                cwd: 'src/web/public/css/',
                src: ['**'],
                dest: 'dev/public/css/'
            }]
        },
        dev: {
            files: getFilesToCopy('dev')
        },
        prod: {
            files: getFilesToCopy('dist')
        }
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
                paths: getLessPaths('dev')
            },
            files: getFilesToLess('dev', 'public')
        },
        devAdmin: {
            options: {
                concat: false,
                paths: getLessPaths('dev')
            },
            files: getFilesToLess('dev', 'admin')
        },
        dev: {
            options: {
                concat: false,
                paths: getLessPaths('dev')
            },
            files: getFilesToLess('dev')
        },
        prod: {
            options: {
                concat: false,
                paths: getLessPaths('dist')
            },
            files: getFilesToLess('dist')
        }
    };

    gruntConfig.preprocess = {
        devPublic: {
            files: getFilesToPreprocess('dev', 'public')
        },
        devAdmin: {
            files: getFilesToPreprocess('dev', 'admin')
        },
        dev: {
            files: getFilesToPreprocess('dev')
        },
        prod: {
            files: getFilesToPreprocess('dist')
        }
    };

    gruntConfig.cssmin = {
        prod: {
            files: [{
                src: './dist/public/admin/css/style.css',
                dest: './dist/public/admin/css/style.min.css'
            }, {
                src: './dist/public/css/style.css',
                dest: './dist/public/css/style.min.css'
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
            files: getFilesToUglify('dist')
        }
    };

    gruntConfig.cleanempty = {
        dev: {
            src: [
                'dev/public/admin/js/',
                'dev/public/admin/css/',
                'dev/public/js/',
                'dev/public/css/'
            ]
        },
        prod: {
            src: [
                'dist/public/admin/js/',
                'dist/public/admin/css/',
                'dist/public/js/',
                'dist/public/css/'
            ]
        }
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
            files: ['src/web/admin/error/**', 'src/web/admin/tmpl/**'],
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
            files: ['src/web/public/error/**', 'src/web/public/tmpl/**'],
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
                'copy:devAdminJs', 'copy:devAdminImg', 'copy:devAdminTmpl', 'copy:devAdminCss', 'less:devAdmin', 'preprocess:devAdmin', 'clean:devLess', 'cleanempty:dev',
                'copy:devPublicJs', 'copy:devPublicImg', 'copy:devPublicTmpl', 'copy:devPublicCss', 'preprocess:devPublic', 'less:devPublic', 'clean:devLess', 'cleanempty:dev'
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
    grunt.registerTask('dev', ['mod:bower', 'mod:npm', 'bower:dev', 'env:dev', 'clean:dev', 'copy:dev', 'patch:dev', 'deploybower:dev', 'less:dev', 'preprocess:dev', 'clean:devLess', 'cleanempty:dev']);
    grunt.registerTask('prod', ['mod:bower', 'mod:npm', 'bower:prod', 'env:prod', 'clean:prod', 'copy:prod', 'patch:prod', 'deploybower:prod', 'less:prod', 'preprocess:prod', 'clean:prodLess', 'cssmin:prod', 'clean:prodMinified', 'uglify:prod', 'clean:prodUglified', 'cleanempty:prod']);


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