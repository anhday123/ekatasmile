import { get, patch, post } from './httpClient'

export const apiAddTax = (object) => post('/tax/addtax', object);
export const apiAllTax = () => get('/tax/gettax')
export const apiSearchTax = (object) => get('/tax/gettax', object)
export const apiUpdateTax = (object, id) => patch(`/tax/updatetax/${id}`, object)
