import { post } from './httpClient'

export const register = (object) => post('/user/register', object);
