const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const querystring = require('querystring')

module.exports.connect = async (connection) => {
    const options = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        autoIndex: true,
        poolSize: 10, // Maintain up to 10 socket connections
        // If not connected, return errors immediately rather than waiting for reconnect
        bufferMaxEntries: 0,
        connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
    }

    if (connection.options.ssl) {
        try {
            options.sslCA = fs.readFileSync(path.resolve(connection.options.certPath))
        } catch (err) {
            throw new Error(`Error in reading the certificate file at path: ${connection.options.certPath}`)
        }
    }

    const uriQuery = { replicaSet: 'rs0', readPreference: 'secondaryPreferred', retryWrites: false }

    if (connection.options.ssl) {
        uriQuery.ssl = 'true'
    }

    const connectionUri = `mongodb://${connection.username}:${connection.password}@${connection.host}:${connection.port}/${connection.database}?${querystring.stringify(uriQuery)}`

    const connectionInstance = await mongoose.connect(connectionUri, options)
    console.log(`MongoDB: ${connection.host}:${connection.port}/${connection.database} connected`)

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', () => {
        console.log(`Mongoose default connection open to ${connection.host}:${connection.port}`)
    })

    // If the connection throws an error
    mongoose.connection.on('error', (err) => {
        console.log('Mongoose default connection error: ' + err)
    })

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose default connection disconnected')
    })

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose default connection disconnected through app termination')
            process.exit(0)
        })
    })

    return connectionInstance
}
