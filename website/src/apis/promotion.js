import { get, patch, post } from './httpClient'
export const getPromotions = (query) => get('/promotion', query)
export const checkPromotion = (body) => post('/promotion/usevoucher', body)
export const addPromotion = (body) => post('/promotion/create', body)
export const updatePromotion = (id, body) => patch(`/promotion/update/${id}`, body)
export const checkVoucher = (voucher) => post('/promotion/checkvoucher', { voucher })
