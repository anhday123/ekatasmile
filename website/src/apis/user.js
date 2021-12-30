import { get, patch, post, destroy } from './httpClient'

export const addUser = (body) => post('/user/adduser', body)
export const apiCreateUserMenu = (object) => post('/user/adduser', object)
export const getUsers = (params) => get('/user/getuser', params)
export const getRoles = () => get('/role/getrole')
export const updateUser = (body, id) => patch(`/user/updateuser/${id}`, body)
export const deleteUsers = (ids) => destroy('/user/delete', { user_id: ids })
