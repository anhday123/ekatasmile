import { get, patch, post } from './httpClient'

export const apiAddInventory = (object) => post('/warehouse/addwarehouse', object);
export const apiAllInventory = (params) => get('/warehouse/getwarehouse', params && params);
export const apiAllInventoryMain = () => get('/warehouse/getwarehouse');
export const apiSearch = (object) => get('/warehouse/getwarehouse', object);
export const apiUpdateInventory = (object, id) => patch(`/warehouse/updatewarehouse/${id}`, object)