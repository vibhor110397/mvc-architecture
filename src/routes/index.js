const express = require('express')

const publicRoutes = require('./publicRoutes')
const privateRoutes = require('./privateRoutes')

const routes = express.Router()

// default route
routes.get('/', (req, res) => res.status(200).json({ msg: 'success' }))

// segregated routes
routes.use('/api', publicRoutes)
routes.use('/api', privateRoutes)

module.exports = routes
