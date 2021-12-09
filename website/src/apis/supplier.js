import { get, patch, post } from './httpClient'

export const apiAddSupplier = (object) => post('/supplier/addsupplier', object)
export const apiAllSupplier = (params) => get('/supplier/getsupplier', params)
export const apiUpdateSupplier = (object, id) => patch(`/supplier/updatesupplier/${id}`, object)
