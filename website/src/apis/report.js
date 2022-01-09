import { get } from './httpClient'

export const getReportInventory = (query) => get('/report/inventory', query)
export const getReportImportExportInventory = (query) =>
  get('/report/input-output-inventory', query)
