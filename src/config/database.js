module.exports = {
    defaultSQL: process.env.DEFAULT_SQL_CONNECTION,

    defaultNoSQL: process.env.DEFAULT_NOSQL_CONNECTION,

    connections: {
        di: {
            host: process.env.DI_NOSQL_HOST,
            port: process.env.DI_NOSQL_PORT,
            username: process.env.DI_NOSQL_USERNAME,
            password: process.env.DI_NOSQL_PASSWORD,
            database: process.env.DI_NOSQL_DB,
            driver: 'mongo',
            options: {
                ssl: true,
                certPath: process.env.DI_NOSQL_CERT_PATH
            }
        },
        adlSql: {
            host: process.env.ADL_SQL_HOST,
            database: process.env.ADL_SQL_DB,
            username: process.env.ADL_SQL_USER,
            password: process.env.ADL_SQL_PASSWORD,
            driver: 'mssql',
            options: {
                connectionTimeout: process.env.ADL_SQL_CONNECT_TIMEOUT,
                requestTimeout: process.env.ADL_SQL_REQUEST_TIMEOUT
            }
        }
    }
}
