import { get, patch, post, destroy } from './httpClient'

export const getDeal = (params) => get('/deal/getdeal',params)
export const updateDeal = (body,id) => patch(`/deal/updatedeal/${id}`,body)