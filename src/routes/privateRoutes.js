const express = require('express')

const authenticateMiddleware = require('../lib/middlewares/auth')

const privateRoutes = express.Router({ mergeParams: true })

// Authenticate Middleware
// You can add array of middlewares too
privateRoutes.use(authenticateMiddleware)

// Actual Routes are defined below.

module.exports = privateRoutes