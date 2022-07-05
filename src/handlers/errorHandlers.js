const memoryUsage = require('../lib/helpers/memoryUsage')

module.exports = (err, req, res, next) => {
    let statusCode = 500
    let message = 'Error'

    if (err.status) statusCode = err.status

    if (err.message) message = err.message

    memoryUsage()
    res.status(statusCode).json({ status: 0, message })
}
