import { get, patch, post } from './httpClient'

export const getCustomer = (params) => get('/customer/getcustomer', params)
export const getAllCustomer = (params) => get('/customer/getcustomer', params)
export const addCustomer = (data) => post('/customer/addcustomer', data)
export const updateCustomer = (id, data) =>
  patch('/customer/updatecustomer/' + id, data)
