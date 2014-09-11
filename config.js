module.exports = {
    dev: {
        host: 'localhost',
        port: 3001,
        env: 'dev',
        db: {
            host: 'localhost',
            port: 27017,
            name: 'jsnbt-dev'
        }
    },
    prod: {
        host: 'localhost',
        port: 4001,
        env: 'prod',
        db: {
            host: 'localhost',
            port: 27017,
            name: 'jsnbt-dev'
        }
    }
};