const path = require('path')

module.exports = {
    default: 'dfDevS3',

    basePath: process.env.UPLOAD_BASE_PATH,

    disks: {
        local: {
            driver: 'local',
            path: path.resolve(path.join(__dirname, '../'))
        },
        dfDevS3: {
            driver: 's3',
            key: process.env.AWS_ACCESS_KEY,
            secret: process.env.AWS_SECRET,
            region: process.env.AWS_REGION,
            bucket: process.env.AWS_BUCKET
        }
    }
}
