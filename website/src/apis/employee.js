import { get, post } from './httpClient'

export const apiUpdateEmployee = (object) => post('/user/adduser', object);
export const apiAllEmployee = () => get('/user/getuser')
export const apiFilterRoleEmployee = (object) => get('/user/getuser', object)
