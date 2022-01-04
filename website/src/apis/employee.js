import { get, post, destroy, patch } from './httpClient'

export const addEmployee = (body) => post('/user/add', body)
export const getEmployees = () => get('/user')
export const updateEmployee = (body, id) => patch(`/user/update/${id}`, body)
export const deleteEmployees = (ids) => destroy('/user/delete', { user_id: ids })
