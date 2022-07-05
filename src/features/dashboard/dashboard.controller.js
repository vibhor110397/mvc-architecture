const moment = require('moment')
const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

const APIResponse = require('../../lib/helpers/response')
const dbRepo = require('../../database/repositories/di')
const config = require('../../config')
const FileSystem = require('../../lib/filesystem')

const service = require('./dashboard.service')

module.exports.initiateUpload = async (req, res, next) => {
    try {
        const { ticketId, companyId, fileCount, fpsName } = req.body

        const folderName = `${companyId}_${ticketId}_${moment().format('YYYYMMDD')}`
        const dataDirectory = `${config.filesystem.basePath}/${folderName}`

        const result = await dbRepo.importRequests.insert({
            adlCompanyId: companyId,
            ticketId,
            fpsName,
            dataDirectory,
            status: config.importRequest.statuses.INITIATED
        })

        const requestId = result._id.toString()

        const signedPostData = []
        const fsInstance = FileSystem.disk(config.filesystem.default)

        for (let i = 0; i < fileCount; i++) {
            signedPostData.push(fsInstance.generateSignedPostData(`${dataDirectory}/${uuid()}.csv`))
        }

        next(new APIResponse({ signedPostData, requestId }))
    } catch (error) {
        next(new Error("Sorry You're not able to initiate this request"))
    }
}

module.exports.getImportList = async (req, res, next) => {
    try {
        const { companyId: adlCompanyId } = req.query
        const query = {
            adlCompanyId,
            status: {
                $not: {
                    $eq: config.importRequest.statuses.DELETED
                }
            }
        }
        const requests = await dbRepo.importRequests.find(query, { populate: ['files'], sort: { updatedAt: -1 } })
        const imports = []

        for (const request of requests) {
            const { _id, adlCompanyId, ticketId, fpsName, status, reviewGeneratedAt, files, isFailed } = request
            let fileCount = 0

            if (files) {
                for (const file of files) {
                    if (file.category === 1) {
                        fileCount += 1
                    }
                }
            }

            imports.push({
                _id,
                adlCompanyId,
                ticketId,
                fpsName,
                status,
                reviewGeneratedAt,
                isFailed,
                fileCount: fileCount
            })
        }

        next(new APIResponse({ imports }))
    } catch (error) {
        next(error)
    }
}

module.exports.updateImportFiles = async (req, res, next) => {
    try {
        const { requestId, filePaths = [] } = req.body

        for (const file of filePaths) {
            await dbRepo.importFiles.insert({
                requestId: requestId,
                fileName: file.fileName,
                category: 1,
                fileSource: {
                    disk: 'dfDevS3',
                    key: file.filePath
                }
            })
        }

        const request = await dbRepo.importRequests.findById(requestId)
        request.status = config.importRequest.statuses.INITIATED
        await request.save()

        next(new APIResponse({}))
    } catch (error) {
        next(error)
    }
}

module.exports.downloadReviewFile = async (req, res, next) => {
    try {
        const { requestId } = req.query

        const result = await dbRepo.importFiles.findOne({
            requestId,
            category: 2
        })

        const fileData = await FileSystem.disk(result.fileSource.disk).getFileData(result.fileSource.key)

        const tempFilePath = path.resolve(path.join(__dirname, '../../../../../.temp', result.fileName))

        fs.writeFileSync(tempFilePath, fileData)

        res.download(tempFilePath, result.fileName, () => {
            fs.unlinkSync(tempFilePath)
        })
    } catch (error) {
        next(error)
    }
}

module.exports.deleteRequest = async (req, res, next) => {
    try {
        const { requestId } = req.params

        await service.softDeleteRequest(requestId)

        next(new APIResponse({ }))
    } catch (error) {
        next(error)
    }
}
