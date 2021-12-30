import { get, patch, post, destroy } from './httpClient'

export const getTransportOrders = (params) => get('/inventory/transport', params)
export const addTransportOrder = (body) => post('/inventory/transport/create', body)
export const deleteTransportOrders = (ids) =>
  destroy('/inventory/transport/delete', { order_id: ids })
export const updateTransportOrder = (body, id) => patch('/inventory/transport/update/' + id, body)
