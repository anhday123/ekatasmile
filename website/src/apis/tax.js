import { get, patch, post } from './httpClient'

export const addTax = (body) => post('/tax/create', body)
export const getTaxs = () => get('/tax')
export const updateTax = (body, id) => patch(`/tax/update/${id}`, body)
