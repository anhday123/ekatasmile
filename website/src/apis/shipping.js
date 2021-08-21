import { get, patch, post } from './httpClient'

export const apiCreateShipping = (object) => post('/transport/addtransport', object);
export const apiAllShipping = () => get('/transport/gettransport');
export const apiSearchShipping = (object) => get('/transport/gettransport', object)
export const apiUpdateShipping = (object, id) => patch(`/transport/updatetransport/${id}`, object)
