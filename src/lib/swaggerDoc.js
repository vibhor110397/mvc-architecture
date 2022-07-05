const config = require('../config')
const packageJson = require('../../package.json')

const SwaggerDoc = (doc) => {
    doc.info.version = packageJson.version
    doc.host = `${config.app.host}:${config.app.port}`
    return doc
}

module.exports = SwaggerDoc
