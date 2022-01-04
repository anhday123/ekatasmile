import { get, patch, post } from './httpClient'

export const addSupplier = (body) => post('/supplier/add', body)
export const getSuppliers = (query) => get('/supplier', query)
export const updateSupplier = (body, id) => patch(`/supplier/update/${id}`, body)
