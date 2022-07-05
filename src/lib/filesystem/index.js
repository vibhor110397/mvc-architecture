const config = require('../../config')
const S3 = require('./s3')
const Local = require('./local')

class FileSystem {
    /**
     *
     *
     * @static
     * @param {String} [disk=config.filesystem.default] Allowed disk name
     * @return {*} Object of the required disk.
     * @memberof FileSystem
     */
    static disk (disk = config.filesystem.default) {
        const diskConfig = config.filesystem.disks[disk]

        if (!diskConfig) {
            throw new Error('Please provide a valid disk')
        }

        let instance
        switch (diskConfig.driver) {
        case 's3':
            instance = new S3(diskConfig)
            break
        case 'local':
            instance = new Local(diskConfig)
            break
        }

        return instance
    }
}

module.exports = FileSystem
