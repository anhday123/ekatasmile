import { get, patch, post } from './httpClient'

export const apiAllWarranty = (params) => get('/warranty/getwarranty', params && params)
export const addWarranty = (data) => post('/warranty/addwarranty', data)
export const updateWarranty = (id, data) => patch('/warranty/updatewarranty/' + id, data)
