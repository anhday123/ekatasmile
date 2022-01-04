import { get, patch, post } from './httpClient'

export const getWarranties = (query) => get('/warranty', query)
export const addWarranty = (body) => post('/warranty/add', body)
export const updateWarranty = (id, data) => patch('/warranty/update/' + id, data)
