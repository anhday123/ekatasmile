import { get, patch, post } from './httpClient'

export const getRoles = (query) => get('/role', query)
export const updateRole = (body, id) => patch(`/role/update/${id}`, body)
export const addRole = (body) => post('/role/add', body)
