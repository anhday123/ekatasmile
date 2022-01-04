import { get, patch, post } from './httpClient'

export const addTax = (body) => post('/tax/add', body)
export const getTaxs = () => get('/tax')
export const updateTax = (body, id) => patch(`/tax/update/${id}`, body)
