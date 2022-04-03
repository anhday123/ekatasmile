import { get } from './httpClient'
export const getStatisticalToday = (query) => get('/statistic/overview/today', query)
export const getStatisticalChart = (query) => get('/statistic/overview/chart', query)
export const getStatisticalProduct = (query) => get('/statistic/overview/top-sell', query)
