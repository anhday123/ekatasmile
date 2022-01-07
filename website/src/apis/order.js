import { get, post, destroy } from './httpClient'

export const apiOrderPromotion = (object) => post('/order/create', object)
export const apiOrderVoucher = (body) => post('/order/create', body)
export const addOrder = (body) => post('/order/create', body)
export const apiAllOrder = (query) => get('/order', query)
export const deleteOrders = (ids) => destroy('/order/delete', { order_id: ids })
