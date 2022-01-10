import { get, patch, post, destroy } from './httpClient'
import axios from 'axios'

export const getOrdersImportInventory = (params) => get('/inventory/import', params)
export const updateOrderImportInventory = (body, id) =>
  patch('/inventory/import/update/' + id, body)
export const createOrderImportInventory = (body) => post('/inventory/import/create', body)
export const deleteOrderImportInventory = (id) =>
  destroy('/inventory/import/delete', { order_id: [id] })
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
