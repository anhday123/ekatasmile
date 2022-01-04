import { get, patch, post } from './httpClient'

export const getAllBranch = (query) => get('/branch', query)
export const addBranch = (body) => post('/branch/create', body)
export const updateBranch = (body, id) => patch(`/branch/update/${id}`, body)
