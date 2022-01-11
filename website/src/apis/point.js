import { get, patch } from './httpClient'
export const getPoint = (params) => get('/pointsetting', params)
export const updatePoint = (body, id) => patch('/pointsetting/update/' + id, body)
