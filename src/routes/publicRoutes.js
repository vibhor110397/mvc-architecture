const express = require('express')
const swaggerUi = require('swagger-ui-express')

const swaggerDoc = require('../../swagger.json')
const swaggerDocument = require('../lib/swaggerDoc')(swaggerDoc)

const publicRoutes = express.Router({ mergeParams: true })

publicRoutes.use('/api-docs', swaggerUi.serve)
publicRoutes.get('/api-docs', swaggerUi.setup(swaggerDocument))

// publicRoutes.use('/dashboard', dashboard.routes.publicRouter)

module.exports = publicRoutes
