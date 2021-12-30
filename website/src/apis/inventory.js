import { get, patch, post, destroy } from './httpClient'
import axios from 'axios'

export const apiAddInventory = (object) => post('/warehouse/addwarehouse', object)
export const apiAllInventory = (params) => get('/warehouse/getwarehouse', params && params)
export const apiAllInventoryMain = () => get('/warehouse/getwarehouse')
export const apiSearch = (object) => get('/warehouse/getwarehouse', object)
export const apiUpdateInventory = (object, id) => patch(`/warehouse/updatewarehouse/${id}`, object)

export const getOrdersImportInventory = (params) => get('/inventory/import', params)
export const updateOrderImportInventory = (body, id) =>
  patch('/inventory/import/update/' + id, body)
export const createOrderImportInventory = (body) => post('/inventory/import/create', body)
export const uploadOrdersImportInventory = (formData) => {
  return axios.post(
    'https://quantribanhang.viesoftware.vn/api/inventory/import/create/file',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: localStorage.getItem('accessToken'),
      },
    }
  )
}
