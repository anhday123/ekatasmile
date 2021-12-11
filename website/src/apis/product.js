import { get, patch, post, destroy } from './httpClient'

export const apiAllProduct = (params) => get('/product/getproduct', { ...params })
export const apiUpdateProduct = (object, id) => patch(`/product/updateproduct/${id}`, object)
export const apiSearchProduct = (object) => get('/product/getproduct', object)
export const apiProductSeller = (params) => get('/saleproduct/getsaleproduct', { ...params })
export const apiUpdateProductStore = (object, id) =>
  patch(`/saleproduct/updatesaleproduct/${id}`, object)
export const apiProductCategory = () => get('/category/getproductincategory')
export const getProducts = (params) => get('/product/getproduct', params)
export const getAttributes = (params) => get('/product/getattribute', params)
export const addProduct = (body) => post('/product/addproduct', body)
export const updateProduct = (body, id) => patch('/product/updateproduct/' + id, body)
export const deleteProducts = (ids) => destroy('/product/deleteproduct?product_id=' + ids)
export const importProduct = (formData) => post('/product/importfile', formData)
export const pricesProduct = () => get('/product/unit')
