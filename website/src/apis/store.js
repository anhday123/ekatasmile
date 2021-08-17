import { get, patch, post } from './httpClient'

export const getAllStore = (params) => get('/store/getstore', params && params);
export const addStore = (object) => post('/store/addstore', object)
export const apiSearch = (object) => get('/store/getstore', object)
export const updateStore = (object, id) => patch(`/store/updatestore/${id}`, object)
// export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)
