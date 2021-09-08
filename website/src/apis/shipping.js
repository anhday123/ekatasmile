import { get, patch, post } from './httpClient'

export const apiCreateShipping = (object) =>
  post('/shipping-company/addshippingcompany', object)
export const apiAllShipping = () => get('/shipping-company/getshippingcompany')
export const apiSearchShipping = (object) =>
  get('/shipping-company/getshippingcompany', object)
export const apiUpdateShipping = (object, id) =>
  patch(`/shipping-company/updateshippingcompany/${id}`, object)
