import { get, post } from './httpClient'

export const getAllLabel = () => get('/label/getlabel')
export const addLabel = (body) => post('/label/addlabel', body)
