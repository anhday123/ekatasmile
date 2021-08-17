import { get, patch, post } from './httpClient'

export const apiCreateShipping = (object) => post('/transport/addtransport', object);
export const apiAllShipping = () => get('/transport/gettransport');
export const apiSearchShipping = (object) => get('/transport/gettransport', object)
export const apiUpdateShipping = (object, id) => patch(`/transport/updatetransport/${id}`, object)
// export const addBranch = (object) => post('/branch/addbranch', object)
// export const apiSearch = (object) => get('/branch/getbranch', object)
// export const apiUpdateBranch = (object, id) => patch(`/branch/updatebranch?branch_id=${id}`, object)
// export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)
