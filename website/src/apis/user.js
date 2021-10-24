import { get, patch, post } from './httpClient'
export const apiAddUser = (object) => post('/user/getuser', object)
export const apiCreateUserMenu = (object) => post('/user/adduser', object)
export const apiAllUser = (params) => get('/user/getuser', params && params)
export const apiAllRole = () => get('/role/getrole')
export const apiSearch = (object) => get('/user/getuser', object)
export const updateUser = (body, id) => patch(`/user/updateuser/${id}`, body)
