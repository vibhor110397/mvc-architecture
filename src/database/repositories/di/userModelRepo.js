const userModel = require('../../models/di/user')

const find = async (filter, params = {}) => {
    let populate
    if (params.populate) {
        populate = params.populate
    }

    const query = userModel.find(filter, null, params)

    if (populate) {
        for (const item of populate) {
            query.populate(item)
        }
    }

    return await query
}

module.exports = {
    find
}