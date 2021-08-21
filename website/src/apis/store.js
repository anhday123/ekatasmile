import { get, patch, post } from './httpClient'

export const getAllStore = (params) => get('/store/getstore', params && params);
export const addStore = (object) => post('/store/addstore', object)
export const apiSearch = (object) => get('/store/getstore', object)
export const updateStore = (object, id) => patch(`/store/updatestore/${id}`, object)
