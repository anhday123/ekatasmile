import { get, patch, post, destroy } from './httpClient'

export const getEnumPlatform = (params) => get('/enum/platform', params)

