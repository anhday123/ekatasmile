import { get, patch, post, destroy } from './httpClient'

export const getCategories = (query) => get('/category', query)
export const getCategoriesWithCreator = (params) => get('/category?_creator=true', params)
export const addCategory = (body) => post('/category/create', body)
export const updateCategory = (body, id) => patch(`/category/update/${id}`, body)
export const deleteCategories = (category_id) =>
  destroy('/category/delete?category_id=' + category_id)
