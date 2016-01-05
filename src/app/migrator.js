var fs = require('fs');

var _ = require('underscore');

var Migrator = function (server) {
    this.server = server;
};

Migrator.prototype.start = function () {
    var self = this;
    
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
                    if (result.count === 0) {
                        migration.fn.process(self.server, function () {

                            migrationsStore.post(function (x) {
                                x.data({
                                    module: migration.module,
                                    name: migration.name,
                                    processedOn: new Date().getTime()
                                });
                            }, function (err, response) {
                                if (err) {
                                    self.server.logger.error(err);
                                    error(err);
                                }
                                else {
                                    self.server.logger.info('migration processed: ' + migration.module + ', ' + migration.name);
                                    migrationsCount++;
                                    runMigration();
                                }
                            });

                        }, function (err) {
                            self.server.logger.error(err);
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
            self.server.logger.info('total migrations processed: ' + migrationsCount);
            done();
        }
    };
    
    var migrationsPath = 'www/migrations';

    if (fs.existsSync(self.server.getPath(migrationsPath))) {
        var packageItems = fs.readdirSync(self.server.getPath(migrationsPath));
        _.each(packageItems, function (packageItem) {
            var packageItemPath = migrationsPath + '/' + packageItem;
            if (fs.lstatSync(self.server.getPath(packageItemPath)).isDirectory()) {
                var packageMigrationItems = fs.readdirSync(self.server.getPath(packageItemPath));

                _.each(packageMigrationItems, function (packageMigrationItem) {
                    var packageMigrationItemPath = migrationsPath + '/' + packageItem + '/' + packageMigrationItem;
                    if (fs.lstatSync(self.server.getPath(packageMigrationItemPath)).isFile()) {

                        try {
                            migrations.push({
                                module: packageItem,
                                name: packageMigrationItem,
                                fn: require(self.server.getPath(packageMigrationItemPath))
                            });
                        }
                        catch (err) {
                            self.server.logger.error(err);
                        }
                    }
                });
            }
        });
    }

    self.server.logger.info('server is updating migrations');
    runMigration();

}

module.exports = function (server) {
    return new Migrator(server);
};