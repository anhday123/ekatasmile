import { post } from './httpClient'

export const apiOTPMain = (object) => post('/authorization/vertifyotp', object);
export const apiOTPForgetPassword = (object) => post('/authorization/getotp', object)