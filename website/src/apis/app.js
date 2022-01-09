import { get, post } from './httpClient'

export const checkDomain = (prefix) => post('/appinfo/checkdomain', { prefix })
