import { get, patch, post } from './httpClient'
export const getPromoton = (params) =>
  get('/promotion/getpromotion', params && params)
export const getAllPromotion = () => get('/promotion/getpromotion')
export const apiCheckPromotion = (object) =>
  post('/promotion/usevoucher', object)
export const addPromotion = (data) => post('/promotion/addpromotion', data)
export const updatePromotion = (id, data) =>
  patch(`/promotion/updatepromotion/${id}`, data)
export const checkVoucher = (voucher) =>
  post('/promotion/checkvoucher', { voucher })
