import { get, patch, post } from './httpClient'

export const apiUpdateEmployee = (object) => post('/user/adduser', object);
export const apiAllEmployee = () => get('/user/getuser')
export const apiFilterRoleEmployee = (object) => get('/user/getuser', object)
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)
