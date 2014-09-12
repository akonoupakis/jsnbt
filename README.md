# jsnbt

## overview

	Getting its name from our well-known json objects, 
	working with NodeJs and MongoDB, 
	jsnbt could grow to be a fast driven CMS for any purpose.
	
## quick start

### install

	NodeJs : http://nodejs.org/download/

	MongoDB : http://nodejs.org/download/

	bower : npm install -g bower
	grunt : npm install -g grunt-cli

### gruntfile.js

	module.exports = function (grunt) {
		require('jsnbt/src/app/grunt.js')(grunt);
	};


### install dependencies

	npm install jsnbt --save
	npm install grunt --save-dev
	npm install grunt-env --save-dev
	npm install grunt-contrib-clean --save-dev
	npm install grunt-contrib-uglify --save-dev
	npm install grunt-contrib-jshint --save-dev
    npm install grunt-contrib-watch --save-dev
    npm install grunt-contrib-less --save-dev
	npm install grunt-contrib-cssmin --save-dev
	npm install grunt-contrib-copy --save-dev
    npm install grunt-preprocess --save-dev
    

## license

	The MIT License (MIT)

	Copyright (c) <year> <copyright holders>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
