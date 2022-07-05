const AWS = require('aws-sdk')

class S3 {
    /**
     *
     * @param {object} config S3 disk config
    */
    constructor (config) {
        this.config = config
        this.instance = undefined
    }

    /**
     *
     * @returns AWS s3 Instance
    */
    getInstance () {
        if (!this.instance) {
            this.instance = new AWS.S3({
                apiVersion: '2006-03-01',
                accessKeyId: this.config.key,
                secretAccessKey: this.config.secret,
                region: this.config.region
            })
        }
        return this.instance
    }

    /**
     *
     * @param {string} path
     * @returns
    */
    async getFileData (path) {
        try {
            this.getInstance()
            const param = { Bucket: this.config.bucket, Key: path }
            const fileData = await this.instance.getObject(param).promise()
            return fileData.Body
        } catch (error) {
            throw new Error(error.message)
        }
    }

    /**
     *
     * @param {string} path
     * @returns
     */
    getFileStream (path) {
        try {
            this.getInstance()
            const param = { Bucket: this.config.bucket, Key: path }

            const fileData = this.instance.getObject(param).createReadStream()
            return fileData
        } catch (error) {
            throw new Error(error.message)
        }
    }

    /**
     *
     * @param {any} data
     * @param {string} path
     * @returns
     */
    async saveFile (data, path) {
        try {
            this.getInstance()
            const param = { Bucket: this.config.bucket, Key: path, Body: data }
            return await this.instance.upload(param).promise()
        } catch (error) {
            throw new Error(error.message)
        }
    }

    generateSignedPostData (key, params = {}) {
        this.getInstance()

        const funcParams = {
            Bucket: this.config.bucket,
            Fields: { key }
        }

        const data = this.instance.createPresignedPost(funcParams)

        return data
    }
}

module.exports = S3
