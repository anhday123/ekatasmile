import { post } from './httpClient'

export const checkUID = (object) => post('/authorization/checkvertifylink', object)
