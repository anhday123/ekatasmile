import { get, patch, post } from './httpClient'

export const apiAllRole = () => get('/permission/getpermission')
export const apiAllRolePermission = (params) => get('/role/getrole', params)
export const apiUpdateRolePermission = (object, id) =>
  patch(`/role/updaterole/${id}`, object)
export const apiAllMenu = () => get('/permission/getmenu')
export const apiAddRole = (object) => post('/role/addrole', object)
export const apiUpdateRole = (object, id) =>
  patch(`/role/updaterole/${id}`, object)
