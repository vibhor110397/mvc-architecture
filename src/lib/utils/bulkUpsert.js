const config = require('../../config')

module.exports = async (documents, model, filters = [], funcConfig = {}) => {
    const results = []
    let counter = 0
    let bulkOps = []
    const chunkSize = funcConfig.chunkSize ?? config.app.nosqlBulkOpArraySize

    for (const document of documents) {
        const filter = {}

        for (const filterKey of filters) {
            filter[filterKey] = document[filterKey]
        }

        bulkOps.push({
            updateOne: {
                filter,
                upsert: true,
                update: document
            }
        })
        counter++

        if (counter % chunkSize === 0) {
            const result = await model.bulkWrite(bulkOps)

            results.push(result)
            bulkOps = []
        }
    }

    if (counter % chunkSize !== 0) {
        const result = await model.bulkWrite(bulkOps)

        results.push(result)
    }

    return results
}
