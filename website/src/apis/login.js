import { get, post } from './httpClient'

export const login = (object) => post('/authorization/login', object);
export const getAllUser = () => get('/user/getuser');
