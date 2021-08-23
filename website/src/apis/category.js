import { get, patch, post } from './httpClient'

export const apiAllCategory = () => get('/category/getcategory');
export const apiAllCategorySearch = (object) => get('/category/getcategory', object);
export const apiAddCategory = (object) => post('/category/addcategory', object)
export const apiUpdateCategory = (object, id) => patch(`/category/updatecategory/${id}`, object)

