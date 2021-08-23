import { get, patch, post } from './httpClient'

export const apiAddProduct = (object) => post('/product/addproduct', object);
export const apiAllProduct = (params) => get('/product/getproduct', {...params});
export const apiUpdateProduct = (object, id) => patch(`/product/updateproduct/${id}`, object)
export const apiSearchProduct = (object) => get('/product/getproduct', object)
export const apiProductSeller = (params) => get('/saleproduct/getsaleproduct', {...params})
export const apiUpdateProductStore = (object, id) => patch(`/saleproduct/updatesaleproduct/${id}`, object)
export const apiProductCategory = () => get('/category/getproductincategory')
export const apiProductCategoryMerge = (object) => get('/category/getproductincategory', object)