import { get } from './httpClient'

export const apiDistrict = (params) => get('/address/getdistrict', params && params)
export const apiProvince = (params) => get('/address/getprovince', params && params)
export const apiCountry = (params) => get('/address/getcountry', params)
