import { get, patch, post, destroy } from './httpClient'

export const getDeal = (params) => get('/deal/getdeal',params)
export const addDeal = (body) => post('/deal/adddeal',body)
export const updateDeal = (body,id) => patch(`/deal/updatedeal/${id}`,body)
export const deleteDeal=(id)=>destroy(`/deal/deletedeal?deal_id=${id}`)