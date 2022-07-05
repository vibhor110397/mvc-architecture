class BadRequestException extends Error {
    constructor (message = 'User not Authenticated') {
        super(message)
        this.name = 'BadRequestException'
        this.status = 400
    }

    static hydrate (error) {
        const { message } = error
        return new BadRequestException(message)
    }
}

module.exports = BadRequestException
