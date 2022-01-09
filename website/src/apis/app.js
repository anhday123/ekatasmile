import { get } from './httpClient'

export const checkDomain = (body) => get('/appinfo/checkdomain', body)
