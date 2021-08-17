import { get, patch, post } from './httpClient'

export const getAllBranch = (params) => get('/branch/getbranch', params && params);
export const getAllBranchMain = () => get('/branch/getbranch');
export const addBranch = (object) => post('/branch/addbranch', object)
export const apiSearch = (object) => get('/branch/getbranch', object)
export const apiSearchSelect = (object) => get(`/branch/getbranch/${object}`)
export const apiFilterCity = (object) => get('/address/getdistrict', object)
export const apiUpdateBranch = (object, id) => patch(`/branch/updatebranch/${id}`, object)
// export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)
