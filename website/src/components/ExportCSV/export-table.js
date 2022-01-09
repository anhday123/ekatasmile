import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const fileExtension = '.xlsx'

const exportTableToCSV = (className, fileName) => {
  const tableHtml = document.querySelector(`.${className} .ant-table-content table`)
  if (tableHtml) {
    const ws = XLSX.utils.table_to_sheet(tableHtml, { raw: true })
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }
}
export default exportTableToCSV
