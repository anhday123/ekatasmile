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
export const apiAllRole = () => get('/permission/getpermission')
export const apiAllRolePermission = () => get('/role/getrole');
export const apiUpdateRolePermission = (object, id) => patch(`/role/updaterole/${id}`, object)
export const apiAllMenu = () => get('/permission/getmenu');
export const apiAddRole = (object) => post('/role/addrole', object);
export const apiUpdateRole = (object, id) => patch(`/role/updaterole/${id}`, object)