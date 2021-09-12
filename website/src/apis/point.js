import { get, patch } from './httpClient'
export const getPointSetting = (params) =>
  get('/point-setting/getpointsetting', params && params)
export const updatePointSetting = (id, data) =>
  patch('/point-setting/updatepointsetting/' + id, data)
