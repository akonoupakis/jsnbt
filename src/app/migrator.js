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

            var runMigration = function (dpd) {
                var migration = migrations.shift();
                if (migration) {
                    dpd.migrations.count({
                        module: migration.module,
                        name: migration.name
                    }, function (result, err) {
                        if (err) {
                            runMigration(dpd);
                        }
                        else {
                            if (result.count === 0) {
                                migration.fn.process(dpd, function () {

                                    dpd.migrations.post({
                                        module: migration.module,
                                        name: migration.name,
                                        processedOn: new Date().getTime()
                                    }, function (response, err) {
                                        if (err) {
                                            logger.error(err);
                                            error(err);
                                        }
                                        else {
                                            logger.info('migration processed: ' + migration.module + ', ' + migration.name);
                                            migrationsCount++;
                                            runMigration(dpd);
                                        }
                                    });

                                }, function (err) {
                                    logger.error(err);
                                    error(err);
                                });
                            }
                            else {
                                runMigration(dpd);
                            }
                        }
                    });


                }
                else {
                    logger.info('total migrations processed: ' + migrationsCount);
                    done();
                }
            };

            var dpd = require('deployd/lib/internal-client').build(server);

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
            runMigration(dpd);

        }

    };

};

module.exports = Migrator;