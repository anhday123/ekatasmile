import { get, patch, post } from './httpClient'

export const apiAddSupplier = (body) => post('/supplier/addsupplier', body)
export const apiAllSupplier = (params) => get('/supplier/getsupplier', params)
export const apiUpdateSupplier = (object, id) => patch(`/supplier/updatesupplier/${id}`, object)
