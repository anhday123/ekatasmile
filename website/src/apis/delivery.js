import { get, patch, post } from './httpClient'

export const getDelivery = (params) => get('/delivery/getdelivery', params && params)

export const addDelivery = data => post('/delivery/adddelivery', data)

export const UpdateDelivery = (id, data) => patch('/delivery/updatedelivery/' + id, data)