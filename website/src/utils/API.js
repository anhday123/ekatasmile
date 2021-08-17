import axios from 'axios'
var data
if (process.browser) {
  data = JSON.parse(localStorage.getItem('statusLogin'))
}
var { accessToken } = data ? data : ''
const defaultHeaders = {
  'Content-type': 'application/json',
  Authorization: `Viesoftware ${accessToken}`,
}

export default async function API(endpoint, method = 'GET', body) {

  return await axios({
    method: method,
    headers: defaultHeaders,
    url: `https://fullfillment.viesoftware.net:1708/api/${endpoint}`,
    data: body,
  }).catch((err) => {

  })
}
