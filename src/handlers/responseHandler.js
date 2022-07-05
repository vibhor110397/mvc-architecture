const memoryUsage = require('../lib/helpers/memoryUsage')

module.exports = (data, req, res, next) => {
    try {
        if (data instanceof Error) throw data

        memoryUsage()

        res.status(200).json({
            status: data.status,
            data: data.data
        })
    } catch (err) {
        next(err)
    }
}
