module.exports = {
    dev: {
        host: 'localhost',
        port: 3000,
        env: 'dev',
        db: {
            host: 'localhost',
            port: 27017,
            name: 'test-dev'
        }
    },
    prod: {
        host: 'localhost',
        port: 4000,
        env: 'prod',
        db: {
            host: 'localhost',
            port: 27017,
            name: 'jsnbt-dev'
        }
    }
};