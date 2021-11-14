import { get } from './httpClient'
export const getStatistical = (params) => get('/statis/getoverview', params)
