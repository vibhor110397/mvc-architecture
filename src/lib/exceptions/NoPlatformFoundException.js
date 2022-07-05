class NoPlatformFoundException extends Error {
    constructor (message = 'No platform found') {
        super(message)
    }
}

module.exports = NoPlatformFoundException
