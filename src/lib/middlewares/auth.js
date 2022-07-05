const AuthenticationFailureException = require('../exceptions/AuthenticationFailureException')

const auth = async (req, res, next) => {
    // eslint-disable-next-line no-constant-condition
    if (true) {
        res.locals = {
            ...res.locals,
            authenticated: true
        }
        next()
    } else {
        next(new AuthenticationFailureException())
    }
}

module.exports = auth
