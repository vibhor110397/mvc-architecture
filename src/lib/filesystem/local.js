const fs = require('fs')
class Local {
    /**
     *
     * @param {string} path
     */
    getFileData (path) {
        return fs.readFileSync(path)
    }

    /**
     * @param {string} path
     */
    getFileStream (path) {}

    /**
     *
     * @param {any} data
     * @param {string} path
     */
    async saveFile (data, path) {}
}

module.exports = Local
