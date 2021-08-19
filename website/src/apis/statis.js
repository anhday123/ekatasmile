import { get } from './httpClient'
export const getStatis = (params) => get('/statis/getstatis', params && params)
