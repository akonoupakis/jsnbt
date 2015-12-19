## 1.0.114

	- ngValidating property on most controls. if true, the field is validated upon validation request. 
	  this used to depend on the !ngDisabled property, but one might want to validate a field on specific cases with the control enabled.
	- ctrlHtml control works with redactor RTE
	- ctrlText and ctrlTextArea ngMaxLength
	- ctrlDatePicker control
	- ctrlCustom and ctrlCustomList controls
	- node.name converted to localized object node.title ({ title: { en: "" } })
	- data.name converted to localized object data.title ({ title: { en: "" } })
	- changed grunt process to gulp. run gulp dev/prod or gulp dev-update instead
	- compress angular templates in production mode
	- renamed scope.node to scope.model (also on scope.item, scope.data etc)



## 1.0.113 (2015-07-26)

	- no further need of server-dev or server-prod start up file. it now gets the environment status from grunting, so one start up file (server-app.js) is enough
	- deployment target changed from "dev/dist" to "www"
	- hosts.json, having the host as it should be on a base href, and the port that the application is hosted on
	- no "public" flag on the site module. the domain code "public" is sufficient
	- removed dpd resources. encapsulated part of its api in the core engine
	- former dpd api is now under jsnbt.db, and the rest resources are located under the /jsnbt-db/ url prefix
	- removed login page infrastructure. restricted nodes end up to a 401 response, but the flow could be intercepted on a new module function (routeNode)
	- changed the api response from (res, err) to (err, res) as in common nodejs
	- added bundles mechanism
	- changed error/ to err/ paths


## 1.0.104 (2015-06-01)

	- messaging providers (modules that are marked as "messager")
	- messaging config defined mail & sms templates
	- messaging debug template view on /jsnbt-dev/mail/{templateCode} and on /jsnbt-dev/sms/{templateCode} with an optional ?model=true parameter to view the template debug model
	

## 1.0.103 (2015-04-23)

	- index.view.preparse() && index.view.postparse() with async callbacks
	

## 1.0.102 (2015-04-19)

	- $scope.base.list, $scope.base.list, $scope.base.form for base controllers

	
## 1.0.101 (2015-04-19)

	- module index files should include domain, public, pointed, section and getVersion() members (moved from config.js)
	- src folders restructure to app,cfg,dat,web