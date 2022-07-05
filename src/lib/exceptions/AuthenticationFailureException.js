class AuthenticationFailureException extends Error {
    constructor (message = 'User not Authenticated') {
        super(message)
        this.name = 'AuthenticationFailureException'
        this.status = 401
    }
}

module.exports = AuthenticationFailureException
