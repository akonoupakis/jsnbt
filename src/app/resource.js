var parse = require('url').parse;
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var path = require('path');
var Script = require('./script');

function Resource(name, options) {
    EventEmitter.call(this);
    this.name = name;

    //this.path = '/' + name;

    this.path = '/dpd/' + name;
    
    options = this.options = options || {};
    this.config = options.config || {};
    this.events = {};
    var instance = this;
    if (this.constructor.external) {
        instance.external = {};
        Object.keys(this.constructor.external).forEach(function (key) {
            if (typeof instance.constructor.external[key] == 'function') {
                instance.external[key] = function () {
                    instance.constructor.external[key].apply(instance, arguments);
                };
            }
        });
    }
}

Resource.external = {};
util.inherits(Resource, EventEmitter);

Resource.prototype.parse = function (url) {
    var parsed = parse(url, true)
      , pathname = parsed.pathname
      , parts = parsed.parts = pathname.split('/');

    // remove empty
    parts.shift();
    parsed.basepath = parts[0];

    // remove empty trailing slash part
    if (parts[parts.length - 1] === '') parts.pop();

    // the last part is always the identifier
    if (parts.length > 1) parsed.id = parts[parts.length - 1];

    if (parsed.query.q && parsed.query.q[0] === '{' && parsed.query.q[parsed.query.q.length - 1] === '}') {
        parsed.query.q = JSON.parse(parsed.query.q);
    }

    return parsed;
};

Resource.prototype.load = function (fn) {
    var resource = this
      , eventNames = this.constructor && this.constructor.events
      , remaining = eventNames && eventNames.length
      , configPath = this.options && this.options.configPath
      , events = this.events = {};

    if (remaining) {
        eventNames.forEach(function (e) {

            var fileName = e.toLowerCase() + '.js'
              , filePath = path.join(configPath, fileName);

            Script.load(filePath, function (err, script) {
                if (script) {
                    events[e] = script;
                }
                remaining--;
                if (remaining <= 0) {
                    fn();
                }
            });
        });
    } else {
        fn();
    }
};

Resource.prototype.handle = function (ctx, next) {
    ctx.end();
};

Resource.toJSON = function () {
    return {
        type: this.name,
        defaultPath: '/my-resource'
    };
};

Resource.prototype.clientGeneration = false;

Resource.prototype.clientGenerationGet = [];

Resource.prototype.clientGenerationExec = [];

Resource.prototype.__resource__ = true;

module.exports = Resource;