import { get, patch, post } from './httpClient'

export const apiAllWarranty = (params) => get('/warranty/getwarranty', params && params)
export const addWarranty = (data) => post('/warranty/addwarranty', data)
// export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)
