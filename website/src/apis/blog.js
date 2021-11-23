import { get, patch, post, destroy } from './httpClient'

export const getBlog=(params)=>get('/blog',params)
export const createBlog=(body)=>post('/blog/create',body)
export const updateBlog=(id,body)=>patch(`/blog/update/${id}`,body)
export const deleteBlog=(id)=>destroy('/blog/delete',id)