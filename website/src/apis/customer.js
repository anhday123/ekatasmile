import { get, patch, post, destroy } from './httpClient'

export const getCustomers = (query) => get('/customer', query)
export const addCustomer = (body) => post('/customer/create', body)
export const deleteCustomers = (ids) => destroy('/customer/delete', { customer_id: ids })
export const updateCustomer = (id, body) => patch('/customer/update/' + id, body)
