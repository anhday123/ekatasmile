import { get, patch, post } from './httpClient'

export const getAllPayment = () => get('/payment/getpayment');
