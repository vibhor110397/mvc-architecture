const winston = require('winston')
const config = require('../config')
// const requestLogRepo = require("../database/repositories/nosql/requestLog");

// eslint-disable-next-line new-cap
module.exports.log = new winston.createLogger({
    transports: [
        new winston.transports.Console({
            timestamp: true,
            level: config.app.logLevel
        })
    ]
})

module.exports.initLogger = (winstonInstance) => {
    winstonInstance.configure({
        level: config.logLevel ?? 'info',
        transports: [
            //
            // - Write all logs error (and below) to `error.log`.
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error'
            }),
            //
            // - Write to all logs with specified level to console.
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            })
        ],
        exceptionHandlers: [
            new winston.transports.File({ filename: 'logs/exceptions.log' })
        ]
    })

    return async (req, res, next) => {
        const start = new Date().getMilliseconds()
        // let requestLog = {
        //   url: req.path,
        //   method: req.method,
        //   requestHeaders: req.headers,
        //   requestQuery: req.query,
        //   requestParams: req.params,
        //   requestBody: req.body,
        //   startedAt: +new Date(),
        // };
        // requestLog = await requestLogRepo.insert(requestLog);

        await next()

        const oldSend = res.send
        // TODO: pending handling for multiple arguments in below line
        res.send = async function (data) {
            const responseLog = {
                responseData: config.debug ? data : undefined,
                completedAt: +new Date(),
                responseCode: res.statusCode,
                responseHeaders: res.getHeaders()
            }
            if (res.statusCode >= 400) {
                responseLog.errData = data
            }
            // await requestLogRepo.update(requestLog, responseLog)
            const ms = new Date().getMilliseconds() - start

            let logLevel
            if (res.statusCode >= 500) {
                logLevel = 'error'
            } else if (res.statusCode >= 400) {
                logLevel = 'warn'
            } else if (res.statusCode >= 100) {
                logLevel = 'info'
            }

            const msg = `${res.statusCode} ${ms}ms`

            winstonInstance.log(logLevel, msg)
            if (req.query?.logStack) {
                winstonInstance.log(
                    'info',
                    `URL params: ${JSON.stringify(req.params)}`
                )
                winstonInstance.log('info', `URL Query: ${JSON.stringify(req.query)}`)
            }
            oldSend.apply(res, arguments)
        }
    }
}
