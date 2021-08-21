import { get } from './httpClient'

export const getAllPayment = () => get('/payment/getpayment');
