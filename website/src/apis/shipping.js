import { get, patch, post, destroy } from './httpClient'

export const apiCreateShipping = (body) => post('/shippingcompany/addshippingcompany', body)
export const apiAllShipping = (params) => get('/shippingcompany/getshippingcompany', params)
export const apiSearchShipping = (params) => get('/shippingcompany/getshippingcompany', params)
export const apiUpdateShipping = (body, id) =>
  patch(`/shippingcompany/updateshippingcompany/${id}`, body)
export const deleteShippings = (ids) =>
  destroy('/shippingcompany/delete', { shipping_company_id: ids })
