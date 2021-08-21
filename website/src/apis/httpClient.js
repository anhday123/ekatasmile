import axios from 'axios'
import { notification } from 'antd'
import { stringify } from 'querystring'
import { decodeToken } from "react-jwt";

export const getNewToken = () => {
    if (
        decodeToken(localStorage.getItem('refreshToken')).exp <
        Math.floor(Date.now() / 1000)
    ) {
        throw new Error('Token expired!')
    }
    try {
        return axios({
            url:
                (process.env.NODE_ENV === 'production'
                    ? process.env.REACT_APP_API_ENDPOINT
                    : process.env.REACT_APP_API_ENDPOINT_DEV) + '/authorization/login',
            headers: {
                'Content-type': 'application/json',
            },
            method: 'POST',
            data: {
                refreshToken: localStorage.getItem('refreshToken'),
            },
        })
    } catch (error) {
        throw new Error('Token expired!')
    }
}

export const FetchAPI = async (
    path,
    method,
    headers,
    body,
    endpoint = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_ENDPOINT
        : process.env.REACT_APP_API_ENDPOINT_DEV
) => {
    if (!headers || !headers.Authorization) {
        const payloadAccessToken = decodeToken(localStorage.getItem('accessToken'))
        if (
            payloadAccessToken &&
            payloadAccessToken.exp < Math.floor(Date.now() / 1000) + 5 * 60
        ) {
            try {
                const response = await getNewToken()

                if (response.status === 200) {
                    localStorage.setItem('accessToken', response.data.accessToken)
                }
            } catch (error) {

                localStorage.clear()
                notification.warning({
                    message: 'Session has expired. Please login again',
                })
                setTimeout(() => {
                    window.location.reload()
                }, 500)
                return {
                    status: 401,
                }
            }
        }
    }
    const defaultHeaders = {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('accessToken'),
        // Authorization: 'Viesoftware ' + localStorage.getItem('accessToken'),
    }
    if (typeof headers === 'object') {
        Object.assign(defaultHeaders, headers)
    }
    try {
        return await axios({
            url: endpoint + path,
            method,
            headers: defaultHeaders,
            data: body,
        })
    } catch (error) {
        if (error.response && error.response.status !== 401) {
            return error.response
        }
     
        return {
            status: 401,
        }
    }
}

export const get = (path, query = {}, headers = {}, endpoint) => {
    return FetchAPI(`${path}?${stringify(query)}`, 'GET', headers, null, endpoint)
}
export const post = (path, body, headers, endpoint) =>
    FetchAPI(path, 'POST', headers, body, endpoint)
export const patch = (path, body, headers, endpoint) =>
    FetchAPI(path, 'PATCH', headers, body, endpoint)
export const destroy = (path, body, headers, endpoint) =>
    FetchAPI(path, 'DELETE', headers, body, endpoint)
