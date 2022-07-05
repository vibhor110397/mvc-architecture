const config = require('../../config')
const dbRepo = require('../../database/repositories/di')

module.exports.softDeleteRequest = async (requestId) => {
    // Set isDeleted to true for request
    await setImportRequestToDeleted(requestId)

    // Set Imported Data To deleted

    await deleteImportedData(requestId)
}

const setImportRequestToDeleted = async (requestId) => {
    const query = {
        _id: requestId
    }

    const data = {
        isDeleted: true,
        deletedAt: new Date(),
        status: config.importRequest.statuses.DELETED
    }
    await dbRepo.importRequests.findOneAndUpdate(query, data)
}

const deleteImportedData = async (requestId) => {
    // Delete adviser Data
    const query = {
        requestId
    }
    const data = {
        deletedAt: new Date()
    }

    await dbRepo.businessClients.updateMany(query, data)
    await dbRepo.advisers.updateMany(query, data)
    await dbRepo.partners.updateMany(query, data)
    await dbRepo.clients.updateMany(query, data)
    await dbRepo.superFunds.updateMany(query, data)
    await dbRepo.investments.updateMany(query, data)
    await dbRepo.importFiles.updateMany(query, data)
    await dbRepo.clientRiskProfiles.updateMany(query, data)
    await dbRepo.countSheet.updateMany(query, data)

    const request = await dbRepo.importRequests.find({ _id: query.requestId })

    await dbRepo.companyRiskProfiles.deleteData({ adlCompanyId: request[0].adlCompanyId })
}
