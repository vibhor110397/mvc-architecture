const express = require('express')
const controller = require('./dashboard.controller')

const publicRouter = express.Router({ mergeParams: true })
const privateRouter = express.Router({ mergeParams: true })

publicRouter.post('/initiate-upload', controller.initiateUpload)
publicRouter.post('/update-import-files', controller.updateImportFiles)
publicRouter.get('/imports/list', controller.getImportList)
publicRouter.get('/download/review-sheet', controller.downloadReviewFile)
publicRouter.delete('/delete/:requestId', controller.deleteRequest)

module.exports = {
    publicRouter,
    privateRouter
}
