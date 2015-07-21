var fs = require('fs');

var _ = require('underscore');

var Migrator = function (server) {

    var logger = require('./logger.js')(this);
    
    return {

        process: function (onSuccess, onError) {

            var migrations = [];
            var migrationsCount = 0;

            var error = function (err) {
                onError(err);
                
            };
            var done = function () {
                onSuccess();
            };

            var runMigration = function (db) {
                var migration = migrations.shift();
                if (migration) {
                    db.migrations.count({
                        module: migration.module,
                        name: migration.name
                    }, function (err, result) {
                        if (err) {
                            runMigration(db);
                        }
                        else {
                            if (result.count === 0) {
                                migration.fn.process(db, function () {

                                    db.migrations.post({
                                        module: migration.module,
                                        name: migration.name,
                                        processedOn: new Date().getTime()
                                    }, function (err, response) {
                                        if (err) {
                                            logger.error(err);
                                            error(err);
                                        }
                                        else {
                                            logger.info('migration processed: ' + migration.module + ', ' + migration.name);
                                            migrationsCount++;
                                            runMigration(db);
                                        }
                                    });

                                }, function (err) {
                                    logger.error(err);
                                    error(err);
                                });
                            }
                            else {
                                runMigration(db);
                            }
                        }
                    });


                }
                else {
                    logger.info('total migrations processed: ' + migrationsCount);
                    done();
                }
            };

            var db = require('./database.js').build(server);

            var migrationsPath = 'www/migrations';

            if (fs.existsSync(server.getPath(migrationsPath))) {
                var packageItems = fs.readdirSync(server.getPath(migrationsPath));
                _.each(packageItems, function (packageItem) {
                    var packageItemPath = migrationsPath + '/' + packageItem;
                    if (fs.lstatSync(server.getPath(packageItemPath)).isDirectory()) {
                        var packageMigrationItems = fs.readdirSync(server.getPath(packageItemPath));

                        _.each(packageMigrationItems, function (packageMigrationItem) {
                            var packageMigrationItemPath = migrationsPath + '/' + packageItem + '/' + packageMigrationItem;
                            if (fs.lstatSync(server.getPath(packageMigrationItemPath)).isFile()) {

                                try {
                                    migrations.push({
                                        module: packageItem,
                                        name: packageMigrationItem,
                                        fn: require(server.getPath(packageMigrationItemPath))
                                    });
                                }
                                catch (err) {
                                    logger.error(err);
                                }
                            }
                        });
                    }
                });
            }

            logger.info('server is updating migrations');
            runMigration(db);

        }

    };

};

module.exports = Migrator;