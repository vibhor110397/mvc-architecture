const config = require('../config')
const mongodb = require('./mongodb')

module.exports.createConnection = async (connection) => {
    if (!config.database.connections[connection]) {
        throw new Error(`Database Connection ${connection} not found`)
    }

    let dbInstance

    switch (config.database.connections[connection].driver) {
    case 'mongo':
        dbInstance = mongodb.connect(config.database.connections[connection])
        break
    }

    return dbInstance
}
