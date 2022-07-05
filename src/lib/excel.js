const xlsx = require('xlsx')
class Excel {
    constructor () {
        this.workbook = undefined
    }

    getWorkBook () {
        if (!this.workbook) {
            this.workbook = xlsx.utils.book_new()
        }

        return this.workbook
    }

    setWorkBook (workbook) {
        if (this.workbook) {
            throw new Error('Workbook already defined')
        }
        this.workbook = workbook

        return this.workbook
    }

    addNewSheetToWorkbook (worksheet, params = {}) {
        const { sheetName = '' } = params

        xlsx.utils.book_append_sheet(this.workbook, worksheet, sheetName)
    }

    addMultipleSheetsToWorkbook (data, params = {}) {
        const { convertToSheet } = params

        for (const sheetName in data) {
            if (Object.hasOwnProperty.call(data, sheetName)) {
                let sheetData = data[sheetName]

                if (convertToSheet) {
                    sheetData = Excel.convertJSONToSheet(sheetData)
                }

                this.addNewSheetToWorkbook(sheetData, { sheetName })
            }
        }
    }

    save (path) {
        xlsx.writeFile(this.workbook, path)
    }

    static convertDataToJson (data, params = {}) {
        const { sheetName } = params
        return xlsx.utils.sheet_to_json(data.Sheets[sheetName])
    }

    static convertJSONToSheet (data = [], params = {}) {
        // const { skipHeader } = params

        return xlsx.utils.json_to_sheet(data)
    }

    static readWorkbook (excel) {
        return xlsx.read(excel, {
            type: 'buffer'
        })
    }
}

module.exports = Excel
