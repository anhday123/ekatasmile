import { get } from './httpClient'
export const getStatistical = (query) => get('/statistic/overview', query)
