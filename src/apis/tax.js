import { get, patch, post } from './httpClient'

export const apiAddTax = (object) => post('/tax/addtax', object);
export const apiAllTax = () => get('/tax/gettax')
export const apiSearchTax = (object) => get('/tax/gettax', object)
export const apiUpdateTax = (object, id) => patch(`/tax/updatetax/${id}`, object)
// export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)
