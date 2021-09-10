import { get, patch, post } from './httpClient'

export const apiAddProduct = (object) =>
  post('/branch-product/addproduct', object)
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
