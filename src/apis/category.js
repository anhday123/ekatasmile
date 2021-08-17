import { get, patch, post } from './httpClient'

export const apiAllCategory = () => get('/category/getcategory');
export const apiAllCategorySearch = (object) => get('/category/getcategory', object);
export const apiAddCategory = (object) => post('/category/addcategory', object)
export const apiUpdateCategory = (object, id) => patch(`/category/updatecategory/${id}`, object)
// export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)
