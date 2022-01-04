import { get } from './httpClient'

export const getActions = (query) => get('/action', query)
