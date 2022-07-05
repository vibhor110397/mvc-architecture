const mssql = require('mssql')

module.exports = function (_connection) {
    this.pool = undefined
    this.connection = _connection

    this.getRequest = async function () {
        try {
            if (!this.pool) {
                await this.getConnectionPool()
            }
            await this.pool.connect()
            return this.pool.request()
        } catch (err) {
            console.error('MSSQL: error creating sql server request >> ', err)
            this.pool = null
        }
    }

    this.getConnectionPool = async function () {
        try {
            if (this.pool) {
                // has the connection pool already been created?
                // if so, return the existing pool
                return this.pool
            }

            // create a new connection pool
            const connectionOptions = {
                server: this.connection.host,
                database: this.connection.database,
                user: this.connection.username,
                password: this.connection.password,
                trustServerCertificate: true
            }

            if (this.connection.options.connectionTimeout) {
                connectionOptions.connectionTimeout = parseInt(this.connection.options.connectionTimeout)
            }

            if (this.connection.options.requestTimeout) {
                connectionOptions.requestTimeout = parseInt(this.connection.options.requestTimeout)
            }

            this.pool = await new mssql.ConnectionPool(connectionOptions)
            console.log(`MSSQL: pool connected at ${this.connection.host}`)

            // catch any connection errors and close the pool
            this.pool.on('error', async (err) => {
                console.error('MSSQL: connection pool error >> ', err)
                await this.closeConnectionPool()
            })
            return this.pool
        } catch (err) {
            // error connecting to SQL Server
            console.error('MSSQL: error connecting to sql server >> ', err)
            this.pool = null
        }
    }

    this.closeConnectionPool = async function () {
        try {
            // try to close the connection pool
            await this.pool.close()

            // set the pool to null to ensure
            // a new one will be created by getConnection()
            this.pool = null
        } catch (err) {
            // error closing the connection (could already be closed)
            // set the pool to null to ensure
            // a new one will be created by getConnection()
            this.pool = null
            console.error('MSSQL: closePool error >> ', err)
        }
    }
}
