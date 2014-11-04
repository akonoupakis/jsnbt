# jsnbt

## overview

	Getting its name from our well-known json objects, 
	working with NodeJs and MongoDB, 
	jsnbt could grow to be a fast driven CMS for any purpose.

	upon install, reroute to /admin to create your first time user.
	create the available languages and content nodes (system urls)

	
## quick start

### install

	NodeJs : http://nodejs.org/download/

	MongoDB : http://nodejs.org/download/
	
	GraphicsMagick : http://www.graphicsmagick.org/download.html

	PhantomJs: http://phantomjs.org/download.html

	bower : npm install -g bower
	grunt : npm install -g grunt-cli

### bootstrap

	easy way to start you up, 
	download a copy of the jsnbt-angular-strap from https://github.com/akonoupakis/jsnbt-strap-angular

	change the name to your site's name on package.json and bower.json
	
	change the database configuration on config.js for dev and production environments
	

### run

	npm install - for grunt dependencies mentioned on package.json
	npm install jsnbt --save - install the jsnbt and save it to package.json

	grunt dev/prod - prepares the application folder for the web server to serve (you may use "grunt dev update-files" to monitor changes in the filesystem and apply them to the application folder while developing)
	
	node server-dev.js (or node server-prod.js) - runs the webserver

	if all worked smoothly, you will be able to se the deployd dashboard at /dashboard and the jsnbt admin at /admin 

	go ahead, create a language, create a page, and start! 
    

## license

	The MIT License (MIT)

	Copyright (c) 2014

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
