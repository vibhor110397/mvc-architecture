const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv')
const winston = require('winston')

dotenv.config({ debug: process.env.APP_DEBUG })

const config = require('./config')
const routes = require('./routes')
const database = require('./database')
const { initLogger } = require('./lib/logger')
const responseHandler = require('./handlers/responseHandler')
const errorHandlers = require('./handlers/errorHandlers')

const app = express()

database.createConnection(config.database.defaultNoSQL)

// Disable HTTP cache
if (config.app.env !== 'production') {
    app.disable('etag')
}

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors())

// secure express app
app.use(
    helmet({
        dnsPrefetchControl: false,
        frameguard: false,
        ieNoOpen: false
    })
)

// parsing the request body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(initLogger(winston))

// fill routes for express application
// TODO: pending error handler middleware for async controllers
app.use(routes)

app.use(responseHandler)
app.use(errorHandlers)
try {
    app.listen(config.app.port, () => {
        console.log(
            `environment: ${config.app.env}; host: ${config.app.host}; port ${config.app.port}`
        )
    })
} catch (err) {
    console.log(err)
}
