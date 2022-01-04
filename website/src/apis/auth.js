import { post } from './httpClient'

export const register = (body) => post('/authorization/register', body)
export const login = (body) => post('/authorization/login', body)
export const checkLink = (body) => post('/authorization/checkverifylink', body)
export const verify = (body) => post('/authorization/verifyotp', body)
export const getOtp = (username) => post('/authorization/getotp', { username })
export const resetPassword = (body) => post('/authorization/recoverypassword', body)
