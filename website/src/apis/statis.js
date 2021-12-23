import { get } from './httpClient'
export const getStatistical = (params) => get('/statistic/overview', params)
