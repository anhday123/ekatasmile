import { get, patch, post } from './httpClient'

export const apiAddSupplier = (object) => post('/supplier/addsupplier', object);
export const apiAllSupplier = () => get('/supplier/getsupplier');
export const apiSearch = (object) => get('/supplier/getsupplier', object)
export const apiUpdateSupplier = (object, id) => patch(`/supplier/updatesupplier/${id}`, object)
// export const addStore = (object) => post('/store/addstore', object)
// export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)
