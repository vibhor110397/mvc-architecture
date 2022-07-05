module.exports = {
    host: process.env.NODE_HOST || 'localhost',

    port: process.env.NODE_PORT || '3000',

    env: process.env.NODE_ENV || 'production',

    logLevel: process.env.APP_LOG_LEVEL || 'debug',

    dbConnection: 'di',

    enableMemoryUsage: parseInt(process.env.ENABLE_MEMORY_USAGE) ?? 0,

    debug: process.env.APP_DEBUG ?? false,

    credentialStore: process.env.APP_CREDENTIAL_STORE?.split(',') ?? [],

    transactionRefreshChunk: process.env.APP_TRANSACTION_REFRESH_CHUNK ?? 100,

    nosqlBulkOpArraySize: process.env.DEFAULT_NOSQL_BULK_OP_SIZE ?? 1000
}
