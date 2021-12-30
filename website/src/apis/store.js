import { get, patch, post } from './httpClient'

export const getAllStore = (params) => get('/store/getstore', params && params)
export const addStore = (body) => post('/store/addstore', body)
export const apiSearch = (params) => get('/store/getstore', params)
export const updateStore = (body, id) => patch(`/store/updatestore/${id}`, body)
