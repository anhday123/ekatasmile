import { get, patch, post, destroy } from './httpClient'
import axios from 'axios'

export const getOrdersImportInventory = (params) => get('/inventory/import', params)
export const updateOrderImportInventory = (body, id) =>
  patch('/inventory/import/update/' + id, body)
export const createOrderImportInventory = (body) => post('/inventory/import/create', body)
export const deleteOrderImportInventory = (id) =>
  destroy('/inventory/import/delete', { order_id: [id] })
export const uploadOrdersImportInventory = (formData) =>
  post('/inventory/import/create/file', formData)
