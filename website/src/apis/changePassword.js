import { post } from './httpClient'

export const changePasswordMain = (object) => post('/user/forgotpassword', object);