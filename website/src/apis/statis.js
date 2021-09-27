import { get } from './httpClient'
export const getStatis = (params) =>
  get('/statis/getoverview', params && params)
