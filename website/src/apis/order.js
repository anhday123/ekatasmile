import { get, post, destroy } from './httpClient'

export const apiOrderPromotion = (object) => post('/order/order', object)
export const apiOrderVoucher = (body) => post('/order/addorder', body)
export const addOrder = (body) => post('/order/addorder', body)
export const apiAllOrder = (params) => get('/order/getorder', params)
export const deleteOrders = (ids) => destroy('/order/delete', { order_id: ids })
