import { get, patch, post } from './httpClient'
export const apiAddUser = (object) => post('/user/getuser', object)
export const apiCreateUserMenu = (object) => post('/user/adduser', object)
export const apiAllUser = () => get('/user/getuser');
export const apiAllRole = () => get('/role/getrole');
export const apiSearch = (object) => get('/user/getuser', object)
export const updateUser = (object, id) => patch(`/user/updateuser/${id}`, object)
// export const apiAddSupplier = (object) => post('/supplier/addsupplier', object);
// export const apiAllSupplier = () => get('/supplier/getsupplier');
// export const addStore = (object) => post('/store/addstore', object)
// export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)
