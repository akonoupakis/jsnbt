# jsnbt
> the jsonbot CMS engine

![VERSION](https://img.shields.io/npm/v/jsnbt.svg)
![DOWNLOADS](https://img.shields.io/npm/dt/jsnbt.svg)
[![ISSUES](https://img.shields.io/github/issues-raw/akonoupakis/jsnbt.svg)](https://github.com/akonoupakis/jsnbt/issues)
[![BUILD](https://api.travis-ci.org/akonoupakis/jsnbt.svg?branch=master)](http://travis-ci.org/akonoupakis/jsnbt)
![LICENCE](https://img.shields.io/npm/l/jsnbt.svg)

[![NPM](https://nodei.co/npm/jsnbt.png?downloads=true)](https://nodei.co/npm/jsnbt/)

## overview
```
Getting its name from our well-known json objects, working with NodeJs and MongoDB, 
jsnbt could grow to be a fast driven CMS for any purpose.

upon install, reroute to /admin to create your first time user.
create the available languages and content nodes (system urls)
```	
	
## quick start

### install
```
> NodeJs : http://nodejs.org/download/
> MongoDB : https://www.mongodb.org/downloads
> ImageMagick : http://www.imagemagick.org/script/download.php
> PhantomJs: http://phantomjs.org/download.html

> bower : npm install -g bower
> gulp : npm install -g gulp
```
### bootstrap
```
download a copy of the jsnbt-angular-strap from 
https://github.com/akonoupakis/jsnbt-strap-angular

change the name to your site's name on package.json

change the hosts and database configuration on hosts.js
```	

### run
```
npm install - for gulp dependencies mentioned on package.json
npm install jsnbt --save - install the jsnbt and save it to package.json

gulp dev/prod - prepares the application folder for the web server to serve
(you may use "gulp dev-update" to monitor changes in the filesystem 
and apply them to the application folder while developing)

node server-app.js - runs the webserver

if all worked smoothly, you will be able to see the jsnbt admin at /admin 
which will ask you for a first time registration to set you up with 
an sa account

go ahead, create a language, create a page, and enjoy!
```

## license
```
The MIT License (MIT)

Copyright (c) 2014 akon

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
```