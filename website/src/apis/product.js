import { get, patch, post, destroy } from './httpClient'

export const getProducts = (query) => get('/product', query)
export const updateProduct = (body, id) => patch(`/product/update/${id}`, body)
export const getAttributes = (query) => get('/product/attribute', query)
export const addProduct = (body) => post('/product/add', body)
export const deleteProducts = (ids) => destroy('/product/delete?product_id=' + ids)
export const importProduct = (formData) => post('/product/importfile', formData)
export const pricesProduct = () => get('/product/unit')
