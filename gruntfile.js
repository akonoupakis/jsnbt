var fs = require('./app/utils/fs.js'),
	pack = require('./app/package.js'),
	path = require('path'),
	async = require('async'),
	_ = require('underscore');

_.str = require('underscore.string');

module.exports = function (grunt) {

	var getFilesToCopy = function (folder) {

		var files = [{
			expand: true,
			cwd: 'files/dpd/',
			src: ['app.dpd', 'node_modules/**', 'resources/**'],
			dest: folder + '/'
		}];

		return files;
	};
    
	grunt.registerMultiTask('mod', 'Install & pack modules', function () {
		if (this.target == 'npm')
		{
			if (fs.existsSync('./npm')) {
			    var found = fs.readdirSync('./npm');
				for (var i in found) {
				    pack.npm.install(found[i], this.data.force);
				}
			}
		}
		else if (this.target == 'bower') {
			var found = fs.readdirSync('./bower');
			for (var i in found) {
			    pack.bower.install(found[i], this.data.force);
			}
		}
	});

	grunt.registerMultiTask('cleanempty', 'Clean empty folders', function () {

		var folder = this.target == 'prod' ? 'dist' : 'dev';

		for (var i = 0; i < this.data.src.length; i++) {
			fs.clean(this.data.src[i], true);
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
	    jshint: {
	        files: ['*.js', '!gruntfile.js', 'app/*.js', 'app/**/*.js'],
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
	        }
	    },
	    copy: {
	        dev: {
	            files: getFilesToCopy('dev')
	        },
	        prod: {
	            files: getFilesToCopy('dist')
	        }
	    }
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-env');

	grunt.registerTask('default', ['jshint']);

	grunt.registerTask('dev', ['mod:npm', 'jshint', 'env:dev', 'clean:dev', 'copy:dev']);
	grunt.registerTask('prod', ['mod:npm', 'jshint', 'env:prod', 'clean:prod', 'copy:prod']);

};