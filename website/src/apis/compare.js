import { get, patch, post } from "./httpClient";

export const getCompare = params => get('/compare/getcompare', params && params)

export const getSession = params => get('/compare/getsession', params && params)

export const addCompare = data => post('/compare/addcompare', data)

export const updateCompare = (id, data) => patch('/compare/getcompare', data)