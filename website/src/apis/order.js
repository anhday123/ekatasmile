import { get, patch, post } from './httpClient'

export const getAllBranch = (params) => get('/branch/getbranch', params && params);
export const apiOrderPromotion = (object) => post('/order/order', object)
export const apiOrderVoucher = (object) => post('/order/addorder', object)
export const apiAllOrder = (object) => get('/order/getorder', object)
// export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)
