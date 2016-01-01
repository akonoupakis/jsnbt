var fs = require('fs-extra');
var path = require('path');
var Stream = require('stream').Stream;
var formidable = require('formidable');
var _ = require('underscore');

_.str = require('underscore.string');

var Router = function (server) {
    this.server = server;
};

Router.prototype.route = function (ctx, next) {
    var authMngr = require('../cms/authMngr.js')(server);

    var current = flow('public/tmp');

    if (ctx.method === 'POST') {

        if (!authMngr.isInRole(ctx.user, 'admin')) {
            ctx.error(401, null, false);
        }
        else {
            var internalPath = './public/files' + (ctx.uri.query.path || '/');

            current.post(ctx.req, function (status, filename, original_filename, identifier, currentTestChunk, numberOfChunks) {

                if (!_.str.endsWith(internalPath, '/'))
                    internalPath += '/';

                var s = fs.createWriteStream(internalPath + filename);

                if (status === 'done') {
                    current.write(identifier, s, {
                        end: true,
                        onDone: function () {

                            current.clean(identifier, {
                                onDone: function () {
                                    s.end();
                                    s.close();
                                }
                            });
                            ctx.end();
                        }
                    });
                }
                else {
                    ctx.end();
                }

            });
        }
    }
    else {
        current.get(ctx, ctx.req, function (status, filename, original_filename, identifier) {
            ctx.writeHead(status === 'found' ? 200 : 204, { "Content-Type": "application/text" });
            ctx.end();
        });
    }
};

var flow = function (temporaryFolder) {
    var $ = this;
    $.temporaryFolder = temporaryFolder;
    $.maxFileSize = null;
    $.fileParameterName = 'file';

    try {
        fs.mkdirSync($.temporaryFolder);
    } catch (e) { }

    function cleanIdentifier(identifier) {
        return identifier.replace(/[^0-9A-Za-z_-]/g, '');
    }

    function getChunkFilename(chunkNumber, identifier) {
        // Clean up the identifier
        identifier = cleanIdentifier(identifier);
        // What would the file name be?
        return path.resolve($.temporaryFolder, './flow-' + identifier + '.' + chunkNumber);
    }

    function validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename, fileSize) {
        // Clean up the identifier
        identifier = cleanIdentifier(identifier);

        // Check if the request is sane
        if (chunkNumber === 0 || chunkSize === 0 || totalSize === 0 || identifier.length === 0 || filename.length === 0) {
            return 'non_flow_request';
        }
        var numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);
        if (chunkNumber > numberOfChunks) {
            return 'invalid_flow_request1';
        }

        // Is the file too big?
        if ($.maxFileSize && totalSize > $.maxFileSize) {
            return 'invalid_flow_request2';
        }

        if (typeof (fileSize) != 'undefined') {
            if (chunkNumber < numberOfChunks && fileSize != chunkSize) {
                // The chunk in the POST request isn't the correct size
                return 'invalid_flow_request3';
            }
            if ((numberOfChunks > 1) && (chunkNumber === numberOfChunks) && (fileSize !== ((totalSize % chunkSize) + parseInt(chunkSize, 10)))) {
                // The chunks in the POST is the last one, and the fil is not the correct size
                return 'invalid_flow_request4';
            }
            if (numberOfChunks == 1 && fileSize != totalSize) {
                // The file is only a single chunk, and the data size does not fit
                return 'invalid_flow_request5';
            }
        }

        return 'valid';
    }

    //'found', filename, original_filename, identifier
    //'not_found', null, null, null
    $.get = function (ctx, req, callback) {
        var chunkNumber = ctx.uri.query.flowChunkNumber;
        var chunkSize = ctx.uri.query.flowChunkSize;
        var totalSize = ctx.uri.query.flowTotalSize;
        var identifier = ctx.uri.query.flowIdentifier;
        var filename = ctx.uri.query.flowFilename;
        if (validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename) == 'valid') {
            var chunkFilename = getChunkFilename(chunkNumber, identifier);
            fs.exists(chunkFilename, function (exists) {
                if (exists) {
                    callback('found', chunkFilename, filename, identifier);
                } else {
                    callback('not_found', null, null, null);
                }
            });
        } else {
            callback('not_found', null, null, null);
        }
    };

    //'partly_done', filename, original_filename, identifier
    //'done', filename, original_filename, identifier
    //'invalid_flow_request', null, null, null
    //'non_flow_request', null, null, null
    $.post = function (req, callback) {

        var form = new formidable.IncomingForm();

        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                return;
            }

            var chunkNumber = fields.flowChunkNumber;
            var chunkSize = fields.flowChunkSize;
            var totalSize = fields.flowTotalSize;
            var identifier = cleanIdentifier(fields.flowIdentifier);
            var filename = fields.flowFilename;

            var original_filename = fields.flowIdentifier;

            if (!files[$.fileParameterName] || !files[$.fileParameterName].size) {
                callback('invalid_flow_request', null, null, null);
                return;
            }
            var validation = validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename, files[$.fileParameterName].size);
            if (validation == 'valid') {
                var chunkFilename = getChunkFilename(chunkNumber, identifier);

                // Save the chunk (TODO: OVERWRITE)
                
                fs.copySync(files[$.fileParameterName].path, chunkFilename);
                // Do we have all the chunks?
                var currentTestChunk = 1;
                var numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);
                var testChunkExists = function () {
                    fs.exists(getChunkFilename(currentTestChunk, identifier), function (exists) {
                        if (exists) {
                            currentTestChunk++;
                            if (currentTestChunk > numberOfChunks) {
                                callback('done', filename, original_filename, identifier, currentTestChunk, numberOfChunks);
                            } else {
                                // Recursion
                                testChunkExists();
                            }
                        } else {
                            callback('partly_done', filename, original_filename, identifier, currentTestChunk, numberOfChunks);
                        }
                    });
                };
                testChunkExists();
            } else {
                callback(validation, filename, original_filename, identifier);
            }
        });
    };

    // Pipe chunks directly in to an existsing WritableStream
    //   r.write(identifier, response);
    //   r.write(identifier, response, {end:false});
    //
    //   var stream = fs.createWriteStream(filename);
    //   r.write(identifier, stream);
    //   stream.on('data', function(data){...});
    //   stream.on('finish', function(){...});
    $.write = function (identifier, writableStream, options) {
        options = options || {};
        options.end = (typeof options.end === 'undefined' ? true : options.end);

        // Iterate over each chunk
        var pipeChunk = function (number) {

            var chunkFilename = getChunkFilename(number, identifier);
            
            fs.exists(chunkFilename, function (exists) {
                if (exists) {
                    // If the chunk with the current number exists,
                    // then create a ReadStream from the file
                    // and pipe it to the specified writableStream.
                    var sourceStream = fs.createReadStream(chunkFilename);
                    sourceStream.pipe(writableStream, {
                        end: false
                    });
                    sourceStream.on('end', function () {
                        // When the chunk is fully streamed,
                        // jump to the next one
                        pipeChunk(number + 1);
                    });
                } else {
                    // When all the chunks have been piped, end the stream
                    if (options.end) writableStream.end();
                    if (options.onDone) options.onDone(identifier);
                }
            });
        };
        pipeChunk(1);
    };

    $.clean = function (identifier, options) {
        options = options || {};

        // Iterate over each chunk
        var pipeChunkRm = function (number) {

            var chunkFilename = getChunkFilename(number, identifier);

            fs.exists(chunkFilename, function (exists) {
                if (exists) {

                    fs.unlink(chunkFilename, function (err) {
                        if (options.onError) options.onError(err);
                    });

                    pipeChunkRm(number + 1);

                } else {

                    if (options.onDone) options.onDone();

                }
            });
        };
        pipeChunkRm(1);
    };

    return $;
};

module.exports = function (server) {
    return new Router();
};