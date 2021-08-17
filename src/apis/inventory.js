import { get, patch, post } from './httpClient'

// export const login = (object) => post('/authorization/login', object);
// export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)
export const apiAddInventory = (object) => post('/warehouse/addwarehouse', object);
export const apiAllInventory = (params) => get('/warehouse/getwarehouse', params && params);
export const apiAllInventoryMain = () => get('/warehouse/getwarehouse');
export const apiSearch = (object) => get('/warehouse/getwarehouse', object);
export const apiUpdateInventory = (object, id) => patch(`/warehouse/updatewarehouse/${id}`, object)