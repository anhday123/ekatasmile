import { get, patch, post, destroy } from './httpClient'

export const getCategories = (params) => get('/category/getcategory', params)
export const apiAddCategory = (object) => post('/category/addcategory', object)
export const apiUpdateCategory = (body, id) =>
  patch(`/category/updatecategory/${id}`, body)
export const deleteCategories = (category_id) =>
  destroy('/category/deletecategory?category_id=' + category_id)
