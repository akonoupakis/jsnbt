var _ = require('underscore');

var Migrator = function (server) {
    this.server = server;
};

Migrator.prototype.start = function () {
    var self = this;

    var logger = this.server.getLogger('jsnbt-migrator');
    
    var migrations = [];
    var migrationsCount = 0;

    var error = function (err) {
        throw err;
        process.exit(1);
    };

    var done = function () {
        process.exit(0);
    };

    var runMigration = function () {
        var migration = migrations.shift();
        if (migration) {
            var migrationsStore = self.server.db.createStore('migrations');
            migrationsStore.count(function (x) {
                x.query({
                    module: migration.module,
                    name: migration.name
                });
            }, function (err, result) {
                if (err) {
                    runMigration();
                }
                else {
                    if (result === 0) {
                        migration.fn(self.server, function (err) {
                            if (err) {
                                logger.error(err);
                                error(err);
                            }
                            else {
                                migrationsStore.post(function (x) {
                                    x.data({
                                        module: migration.module,
                                        name: migration.name,
                                        processedOn: new Date().getTime()
                                    });
                                }, function (err, response) {
                                    if (err) {
                                        logger.error(err);
                                        error(err);
                                    }
                                    else {
                                        logger.info('migration processed: ' + migration.module + ', ' + migration.name);
                                        migrationsCount++;
                                        runMigration();
                                    }
                                });
                            }
                        }, function (err) {
                            logger.error(err);
                            error(err);
                        });
                    }
                    else {
                        runMigration();
                    }
                }
            });

        }
        else {
            logger.info('total migrations processed: ' + migrationsCount);
            done();
        }
    };
    
    _.each(self.server.app.modules.all, function (module) {
        if (_.isArray(module.migrations)) {
            _.each(module.migrations, function (migration) {
                migrations.push({
                    module: module.domain,
                    name: migration.name,
                    fn: migration.process
                });
            });
        }
    });

    logger.info('server is updating migrations');
    runMigration();

}

module.exports = function (server) {
    return new Migrator(server);
};