import { get, patch, post } from './httpClient'

export const apiCreateShipping = (object) =>
  post('/shippingcompany/addshippingcompany', object)
export const apiAllShipping = () => get('/shippingcompany/getshippingcompany')
export const apiSearchShipping = (object) =>
  get('/shippingcompany/getshippingcompany', object)
export const apiUpdateShipping = (object, id) =>
  patch(`/shippingcompany/updateshippingcompany/${id}`, object)
