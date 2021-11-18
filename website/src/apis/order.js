import { get, post } from './httpClient'

export const apiOrderPromotion = (object) => post('/order/order', object)
export const apiOrderVoucher = (object) => post('/order/addorder', object)
export const apiAllOrder = (object) => get('/order/getorder', object)
