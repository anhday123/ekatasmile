import { get, patch, post } from './httpClient'

export const getAllBranch = (params) => get('/branch/getbranch', params)
export const getAllBranchMain = () => get('/branch/getbranch')
export const addBranch = (object) => post('/branch/addbranch', object)
export const apiSearch = (object) => get('/branch/getbranch', object)
export const apiSearchSelect = (object) => get(`/branch/getbranch/${object}`)
export const apiFilterCity = (object) => get('/address/getdistrict', object)
export const apiUpdateBranch = (body, id) => patch(`/branch/updatebranch/${id}`, body)
