import { get, patch, post } from './httpClient'

export const apiAddSupplier = (object) => post('/supplier/addsupplier', object);
export const apiAllSupplier = () => get('/supplier/getsupplier');
export const apiSearch = (object) => get('/supplier/getsupplier', object)
export const apiUpdateSupplier = (object, id) => patch(`/supplier/updatesupplier/${id}`, object)
