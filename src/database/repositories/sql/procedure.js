const config = require('../../../config')
const SqlClient = require('../../mssql')

const procedure = async (procedure, params = {}, options = { connection: '' }) => {
    try {
        if (options.connection === '') { options.connection = config.database.connections.adlSql }
        const request = await new SqlClient(options.connection).getRequest()

        for (const key in params) {
            request.input(key, params[key])
        }

        if (config.app.debug) { console.log(procedure, ':', params) }

        return await request.execute(procedure)
    } catch (err) {
        console.log(err)
        throw err
    }
}

const sqlGetAdvisers = async (params) => {
    let result = await procedure('sp_di_get_advisers_list', params)
    result = result.recordset

    return result
}

const sqlGetRiskProfile = async (params) => {
    let result = await procedure('sp_di_get_adl_risk_profiles', params)
    result = result.recordset

    return result
}

const sqlGetBusinessClients = async (params) => {
    let result = await procedure('sp_di_get_business_client_list', params)
    result = result.recordset

    return result
}

const sqlGetPlatformsList = async (params) => {
    let result = await procedure('sp_di_get_platforms_list', params)
    result = result.recordset

    return result
}

module.exports = {
    sqlGetAdvisers,
    sqlGetRiskProfile,
    sqlGetBusinessClients,
    sqlGetPlatformsList
}
