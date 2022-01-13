import { get, patch } from './httpClient'
export const getPoint = (query) => get('/pointsetting', query)
export const updatePoint = (body, id) => patch('/pointsetting/update/' + id, body)
