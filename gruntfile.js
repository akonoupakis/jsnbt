var fs = require('./app/utils/fs.js'),
	pack = require('./app/package.js'),
	path = require('path'),
	bower = require('bower'),
	async = require('async'),
	_ = require('underscore');

_.str = require('underscore.string');

module.exports = function (grunt) {

	var getFilesToCopy = function (folder) {

		var files = [{
			expand: true,
			cwd: 'src/dpd/',
			src: ['app.dpd', 'node_modules/**', 'resources/**'],
			dest: folder + '/'
		},
		{
			expand: true,
			cwd: 'src/web/public/',
			src: ['img/**', 'js/**', 'font/**', 'css/**', 'tmpl/partial/**', 'tmpl/spec/**', 'files/**'],
			dest: folder + '/public/'
		},
		{
			expand: true,
			cwd: 'src/web/admin/',
			src: ['img/**', 'js/**', 'font/**', 'css/**', 'tmpl/partial/**'],
			dest: folder + '/public/admin/'
		}];

		return files;
	};

	var getFilesToPreprocess = function (folder, site) {

		var files = [];

		if (site === undefined || site === 'admin') {
			if (fs.existsSync('./src/web/admin/tmpl/error')) {
				var adminErrorFiles = fs.readdirSync('./src/web/admin/tmpl/error');
				for (var i in adminErrorFiles) {
					files.push({
						src: './src/web/admin/tmpl/error/' + adminErrorFiles[i],
						dest: './' + folder + '/public/admin/tmpl/error/' + adminErrorFiles[i]
					});
				}
			}
			if (fs.existsSync('./src/web/admin/tmpl/view')) {
				var adminViewFiles = fs.readdirSync('./src/web/admin/tmpl/view');
				for (var i in adminViewFiles) {
					files.push({
						src: './src/web/admin/tmpl/view/' + adminViewFiles[i],
						dest: './' + folder + '/public/admin/tmpl/view/' + adminViewFiles[i]
					});
				}
			}
		}
		if (site === undefined || site === 'public') {
			if (fs.existsSync('./src/web/public/tmpl/error')) {
				var publicErrorFiles = fs.readdirSync('./src/web/public/tmpl/error');
				for (var i in publicErrorFiles) {
					files.push({
						src: './src/web/public/tmpl/error/' + publicErrorFiles[i],
						dest: './' + folder + '/public/tmpl/error/' + publicErrorFiles[i]
					});
				}
			}
			if (fs.existsSync('./src/web/public/tmpl/view')) {
				var publicViewFiles = fs.readdirSync('./src/web/public/tmpl/view');
				for (var i in publicViewFiles) {
				    files.push({
				        src: './src/web/public/tmpl/view/' + publicViewFiles[i],
				        dest: './' + folder + '/public/tmpl/view/' + publicViewFiles[i]
				    });
				}
			}
		}

		return files;
	};

	var getFilesToLess = function (folder, site) {
		var files = [];

		if (site === undefined || site === 'admin') {
			files.push({
				src: folder + '/public/admin/css/*.less',
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
	    return [{
	        src: ['./' + folder + '/public/admin/js/lib/*.js', './' + folder + '/public/admin/js/lib/**/**.js'],
			dest: './' + folder + '/public/admin/js/lib.min.js'
		}, {
		    src: ['./' + folder + '/public/admin/js/app/main.js', './' + folder + '/public/admin/js/app/**/main.js', './' + folder + '/public/admin/js/app/**/**.js'],
			dest: './' + folder + '/public/admin/js/app.min.js'
		}, {
		    src: ['./' + folder + '/public/admin/js/init.js'],
		    dest: './' + folder + '/public/admin/js/init.min.js'
		},
		{
			src: ['./' + folder + '/public/js/lib/**/**.js'],
			dest: './' + folder + '/public/js/lib.min.js'
		}, {
			src: ['./' + folder + '/public/js/app/main.js', './' + folder + '/public/js/app/**/*.js'],
			dest: './' + folder + '/public/js/app.min.js'
		}, {
			src: ['./' + folder + '/public/js/init.js'],
			dest: './' + folder + '/public/js/init.min.js'
		}]
	};

	grunt.registerMultiTask('mod', 'Install & pack modules', function () {
	    if (this.target == 'npm') {
	        if (fs.existsSync('./npm')) {
	            var found = fs.readdirSync('./npm');
	            for (var i in found) {
	                pack.npm.install(found[i], this.data.force);
	            }
	        }
	    }
	    else if (this.target == 'bower') {
	        if (fs.existsSync('./bower')) {
	            var found = fs.readdirSync('./bower');
	            for (var i in found) {
	                pack.bower.install(found[i], this.data.force);
	            }
	        }
	    }
	});

	grunt.registerMultiTask('patch', 'Patch the copied with the package files', function () {

		var folder = this.target == 'prod' ? 'dist' : 'dev';

		var found = fs.readdirSync('./src/pck');
		for (var i in found) {
			pack.npm.deploy(found[i], folder);
		}
	});

	grunt.registerMultiTask('cleanempty', 'Clean empty folders', function () {

		var folder = this.target == 'prod' ? 'dist' : 'dev';

		for (var i = 0; i < this.data.src.length; i++) {
			fs.clean(this.data.src[i], true);
		}
	});

	grunt.registerMultiTask('bower', 'Install bower components', function () {

		var exec = require('child_process').exec,
			sys = require('sys');
		
		var tasks = [];
		var done = this.async();

		var add = function (successMessage, fn) {
			tasks.push(function (callback) {
				fn(function () {
					grunt.log.ok(successMessage);
					callback();
				});
			});
		};
		
		var bowerPackageNames = [];
		var bowerPackages = [];

		var bowerConfigs = [];
		bowerConfigs.push(require('./bower.json'));
		
		var installedPackages = pack.npm.getInstalled();
		for (var i = 0; i < installedPackages.length; i++) {
			if (fs.existsSync('./node_modules/' + installedPackages[i] + '/bower.json')) {
				bowerConfigs.push(require('./node_modules/' + installedPackages[i] + '/bower.json'));
			}
		}
		
		for (var i = 0; i < bowerConfigs.length; i++) {
			var bowerConfig = bowerConfigs[i];

			if (bowerConfig.dependencies) {
				for (var dep in bowerConfig.dependencies) {
					if (!fs.existsSync('./bower_components/' + dep)) {
						if (bowerPackageNames.indexOf(dep) === -1) {
							bowerPackages.push(dep + '#' + bowerConfig.dependencies[dep]);
							bowerPackageNames.push(dep);
						}
					}
				}
			}
		}
		
		add('installes bower packages', function (callback) {
			bower.commands.install(bowerPackages, {
				cwd: './',
				force: true
			})
			  .on('log', function (result) {
				  console.log(['bower', result.id.cyan, result.message].join(' '));
			  })
			  .on('error', function (error) {
				  grunt.fail.fatal(error);
			  })
			  .on('end', callback);
		});

		async.series(tasks, done);
	});

	grunt.registerMultiTask('deploybower', 'Deploy bower components', function () {
		var folder = this.target == 'prod' ? 'dist' : 'dev';

		var bowerComponents = "bower_components";

		var bowerConfigs = [];
		bowerConfigs.push(require('./bower.json'));

		var installedPackages = pack.npm.getInstalled();
		for (var i = 0; i < installedPackages.length; i++) {
			if (fs.existsSync('./node_modules/' + installedPackages[i] + '/bower.json')) {
				bowerConfigs.push(require('./node_modules/' + installedPackages[i] + '/bower.json'));
			}
		}

		for (var i = 0; i < bowerConfigs.length; i++) {
			var bowerConfig = bowerConfigs[i];

			if (bowerConfig.dependencies) {
				if (bowerConfig.deploy) {
					for (var deployd in bowerConfig.deploy) {
						var packName = deployd;
						if (bowerConfig.dependencies[packName]) {
							var packSpecs = bowerConfig.deploy[packName];
							
							if (packSpecs.folders) {
							    for (p = 0; p < packSpecs.folders.length; p++) {

							        var folderSpecs = packSpecs.folders[p];

							        if (folderSpecs.src && folderSpecs.dest) {
							            folderSpecs.src = typeof (folderSpecs.src) !== 'string' ? folderSpecs.src : [folderSpecs.src];
							            folderSpecs.dest = typeof (folderSpecs.dest) !== 'string' ? folderSpecs.dest : [folderSpecs.dest];

							            for (var ii = 0; ii < folderSpecs.src.length; ii++) {
							                for (var iii = 0; iii < folderSpecs.dest.length; iii++) {
							                    var sourceDir = './' + bowerComponents + '/' + folderSpecs.src[ii];
							                    var targetDir = './' + folder + '/public/' + folderSpecs.dest[iii];

							                    if (fs.existsSync(sourceDir)) {
							                        if (!fs.existsSync(targetDir))
							                            fs.create(targetDir);

							                        fs.copy(sourceDir, targetDir, true);
							                    }
							                }
							            }
							        }

							    }
							}
							if (packSpecs.files)
							{
							    for (p = 0; p < packSpecs.files.length; p++) {

							        var fileSpecs = packSpecs.files[p];

							        if (fileSpecs.src && fileSpecs.dest) {
							            fileSpecs.src = typeof (fileSpecs.src) !== 'string' ? fileSpecs.src : [fileSpecs.src];
							            fileSpecs.dest = typeof (fileSpecs.dest) !== 'string' ? fileSpecs.dest : [fileSpecs.dest];

							            for (var ii = 0; ii < fileSpecs.src.length; ii++) {
							                for (var iii = 0; iii < fileSpecs.dest.length; iii++) {
							                    var sourceFile = './' + bowerComponents + '/' + fileSpecs.src[ii];
							                    var targetFile = './' + folder + '/public/' + fileSpecs.dest[iii];

							                    if (fs.existsSync(sourceFile)) {
							                        var sourceFileName = path.basename(sourceFile);

							                        var targetFolder = targetFile.substring(0, targetFile.lastIndexOf('/'));

							                        if (!fs.existsSync(targetFolder))
							                            fs.create(targetFolder);

							                        fs.copy(sourceFile, targetFile, true);
							                    }
							                }
							            }
							        }

							    }
							}
						}
					}
				}
			}
		}
	});

	grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    mod: {
	        bower: {
	            force: true
	        },
	        npm: {
	            force: true
	        }
	    },
	    bower: {
	        dev: {},
	        prod: {}
	    },
	    jshint: {
	        files: ['*.js', '!gruntfile.js', 'app/*.js', 'app/**/*.js', 'src/web/admin/js/**/*.js', 'src/web/public/js/**/*.js'],
	        options: {
	            globals: {
	                jQuery: true,
	                console: true,
	                module: true,
	                document: true,
	                angular: true
	            }
	        }
	    },
	    env: {
	        options: {},
	        dev: {
	            NODE_ENV: 'DEVELOPMENT'
	        },
	        prod: {
	            NODE_ENV: 'PRODUCTION'
	        }
	    },

	    clean: {
	        dev: {
	            options: { force: true },
	            src: ['dev']
	        },
	        prod: {
	            options: { force: true },
	            src: ['dist']
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
				"dist/public/admin/js/app",
				"dist/public/admin/js/lib",
				"dist/public/admin/js/*.js",
				"!dist/public/admin/js/*.min.js",
				"dist/public/js/app",
				"dist/public/js/lib",
				"dist/public/js/*.js",
				"!dist/public/js/*.min.js",
	        ]
	    },
	    copy: {
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
	                cwd: 'src/web/public/tmpl/view/',
	                src: ['spec/**'],
	                dest: 'dev/public/tmpl/'
	            }, {
	                expand: true,
	                onlyIf: 'newer',
	                cwd: 'src/web/admin/tmpl/',
	                src: ['partial/**'],
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
	                src: ['partial/**', 'spec/**'],
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
	    },
	    patch: {
	        dev: {},
	        prod: {}
	    },
	    deploybower: {
	        dev: {},
	        prod: {}
	    },
	    less: {
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
	    },
	    preprocess: {
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
	    },
	    cssmin: {
	        prod: {
	            files: [{
	                src: './dist/public/admin/css/style.css',
	                dest: './dist/public/admin/css/style.min.css'
	            }, {
	                src: './dist/public/css/style.css',
	                dest: './dist/public/css/style.min.css'
	            }]
	        }
	    },

	    uglify: {
	        prod: {
	            options: {
	                preserveComments: false,
	                mangle: false,
	                compress: false,
	                wrap: false
	            },
	            files: getFilesToUglify('dist')
	        }
	    },
	    cleanempty: {
	        dev: {
	            src: [
					'dev/public/admin/css/',
					'dev/public/css/'
	            ]
	        },
	        prod: {
	            src: [
					'dist/public/admin/css/',
					'dist/public/css/'
	            ]
	        }
	    },
	    watch: {
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
	            files: ['src/web/admin/tmpl/error/**', 'src/web/admin/tmpl/view/**'],
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
	            files: ['src/web/public/tmpl/error/**', 'src/web/public/tmpl/view/**'],
	            tasks: ['preprocess:devPublic']
	        },
	        publicFiles: {
	            files: ['src/web/public/**'],
	            tasks: ['copy:devPublicJs', 'copy:devPublicImg', 'copy:devPublicTmpl', 'preprocess:devPublic']
	        },
	        publicAll: {
	            files: ['src/web/public/**'],
	            tasks: ['copy:devPublicJs', 'copy:devPublicImg', 'copy:devPublicTmpl', 'copy:devPublicCss', 'preprocess:devPublic', 'less:devPublic', 'clean:devLess', 'cleanempty:dev']
	        }
		},
		html2js: {
			//options: {
			//  rename : function (moduleName) {
			//	return moduleName.replace('web/', '');
			//  }
			//},
		    dev: {
                files: [{
                    src: ['dev/public/admin/tmpl/partial/*.html'],
			        dest: 'dev/public/admin/js/tmpl.js'
                }]
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-env');

	grunt.registerTask('default', ['jshint']);

	grunt.registerTask('dev', ['mod:bower', 'mod:npm', 'bower:dev', 'jshint', 'env:dev', 'clean:dev', 'copy:dev', 'patch:dev', 'deploybower:dev', 'less:dev', 'preprocess:dev', 'clean:devLess', 'cleanempty:dev']);
	grunt.registerTask('prod', ['mod:bower', 'mod:npm', 'bower:prod', 'jshint', 'env:prod', 'clean:prod', 'copy:prod', 'patch:prod', 'deploybower:prod', 'less:prod', 'preprocess:prod', 'clean:prodLess', 'cssmin:prod', 'clean:prodMinified', 'uglify:prod', 'clean:prodUglified', 'cleanempty:prod']);

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
};