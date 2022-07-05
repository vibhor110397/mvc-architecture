const config = require('../../config')
module.exports = () => {
    if (config.app.enableMemoryUsage) {
        const used = process.memoryUsage()
        for (const key in used) {
            // eslint-disable-next-line no-irregular-whitespace
            console.log(`${key} - ${Math.round(used[key] / 1024 / 1024 * 100) / 100}​​​​​​​​MB`)
        }
    }
}
