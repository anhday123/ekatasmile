import { get, patch, post, destroy } from './httpClient'

export const getCustomer = (params) => get('/customer/getcustomer', params)
export const getAllCustomer = (params) => get('/customer/getcustomer', params)
export const addCustomer = (body) => post('/customer/addcustomer', body)
export const deleteCustomers = (ids) => destroy('/customer/delete', { customer_id: ids })
export const updateCustomer = (id, body) => patch('/customer/updatecustomer/' + id, body)
