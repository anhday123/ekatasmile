import { get, patch, post, destroy } from './httpClient'

export const apiAllProduct = (params) =>
  get('/product/getproduct', { ...params })
export const apiUpdateProduct = (object, id) =>
  patch(`/product/updateproduct/${id}`, object)
export const apiSearchProduct = (object) => get('/product/getproduct', object)
export const apiProductSeller = (params) =>
  get('/saleproduct/getsaleproduct', { ...params })
export const apiUpdateProductStore = (object, id) =>
  patch(`/saleproduct/updatesaleproduct/${id}`, object)
export const apiProductCategory = () => get('/category/getproductincategory')
export const apiProductCategoryMerge = (object) =>
  get('/category/getproductincategory', object)
export const getProductsBranch = (params) =>
  get('/branch-product/getproduct', params)
export const updateProductBranch = (body, id) =>
  patch('/branch-product/updateproduct/' + id, body)
export const getProductsStore = (params) =>
  get('/store-product/getproduct', params)
export const updateProductStore = (body, id) =>
  patch('/store-product/updateproduct/' + id, body)
export const deleteProductBranch = (body) =>
  destroy('/branch-product/deleteproduct', body)
export const deleteProductStore = (body) =>
  destroy('/store-product/deleteproduct', body)
export const getProducts = (params) => get('/product/getproduct', params)
export const getAttributes = (params) => get('/product/getattribute', params)
export const addProduct = (body) => post('/product/addproduct', body)
export const updateProduct = (body, id) =>
  patch('/product/updateproduct/' + id, body)
