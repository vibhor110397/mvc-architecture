const mssql = require('mssql')

module.exports.createTableType = (name) => {
    let tableType
    switch (name) {
    case 'udtt_di_import_files':
        tableType = importFiles()
        break
    }

    return tableType
}

const importFiles = () => {
    const tableType = new mssql.Table()
    tableType.columns.add('import_id', mssql.Int)
    tableType.columns.add('file_name', mssql.VarChar(100))
    tableType.columns.add('file_path', mssql.VarChar(200))

    return tableType
}
