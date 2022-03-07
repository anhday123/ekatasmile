import { get, patch, post, destroy } from './httpClient'

export const addShipping = (body) => post('/shippingcompany/create', body)
export const getShippings = (query) => get('/shippingcompany', query)
export const updateShipping = (body, id) => patch(`/shippingcompany/update/${id}`, body)
export const deleteShippings = (ids) =>
  destroy('/shippingcompany/delete', { shipping_company_id: ids })
export const addShippingControlWithFile = (formData, id) =>
  post('/shippingcompany/compare/import', formData)
export const getShippingControlList = (query) => get('/shippingcompany/compare/card', query)
export const getStatusShipping = () => get('/enum/shipping')
