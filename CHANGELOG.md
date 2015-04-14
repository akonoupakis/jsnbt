## 1.0.100 (unreleashed)

Features

	- Buintin cache provider (memory based). can be overriden on application.init();
	- dpd pre & post events fed upon server options. 
	- dpd authorization engine upon pre events. Add { auth: false } to the config.permissions collection to avoid the main auth check.
	- dpd action logging upon post events
	- Messager infrastructure for sending mail and sms messages

## 1.0.99 (2015-13-31)

Features:

	- deployd data caching: dpd.collection.getCached() function caching by query, invalidated on POST/PUT/DELETE requests of the same collection.

## 1.0.97 (2015-03-26)

Improvements:
	
	- common bower components directory, version number in folder names!
	- the bower.json file contents should be returned in a getBower() function in the index file

## 1.0.96 (2015-03-26)

Improvements:
	
	- different bower component directories for public and admin configs

## 1.0.95 (2015-03-18)

Bugfixes:
	
	- grunt fix. was not preprocessing correctly

## 1.0.91 (2015-03-13)

Bugfixes:
	
	- null user fix. On the first request after an application start the user was null

## 1.0.90 (2015-03-12)

Improvements:

  - jsnbt-api getting post and get parameters and leave it up to the api to end the request.
	


## 1.0.87 (2015-03-10)

Features:

  - Impersonation of the public site (for development)
	/dbg/index.js & /dbg/config.js. 
	Feed this file in the init method of the server-dev.js file config.routes



## 1.0.82 (2015-03-09)

Bugfixes:

	- Minor fixes on config.routes. Added a "fn" property that is a function name placed in the index file of a module



## 1.0.81 (2015-03-09)

Features:

  - config.routes
  - "custom" entity triggering a custom route



## 1.0.80 (2015-03-08)

Features:

  - File groups. 
	A feature to separate the uploaded files into distinct folders. 
	The default group is "public" having its files under "files/public/". 
	The file and image controls can specify the ngFileGroup for the target group needed per case.
	The file groups are defined in each module's config.js file.

  - dpd.collection.count supported

  - no longer pre-creating nodes or data in admin before the initial save click

 Improvements:

  - 
  - 
  - 

Bugfixes:

  - 
  - 
  - 

Breaking Changes:

  - 
  - 
  - 