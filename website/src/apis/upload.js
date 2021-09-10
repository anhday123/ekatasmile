import axios from 'axios'
import moment from 'moment'
import S3 from 'aws-sdk/clients/s3'
import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

export const uploadImg = (formData) =>
  axios.post('https://ecom-fulfill.com/api/fileupload/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

export const uploadImgs = (formData) =>
  axios.post(
    'https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

/* config upload S3 */
const wasabiEndpoint = new AWS.Endpoint(process.env.REACT_APP_S3_URL)
const ENDPOINT_URL_IMAGE = `${process.env.REACT_APP_S3_URL}/admin-order/`
const upload = new S3({
  endpoint: wasabiEndpoint,
  region: process.env.REACT_APP_REGION,
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
})
/* config upload S3 */

export const uploadFile = async (file) => {
  try {
    const _d = moment(new Date()).format('YYYY/MM/DD') + '/' + uuidv4()

    if (!file) return ''

    let fileName = file.name.split('.')
    const fileNameUpload = _d + '/' + fileName.toString().replaceAll(',', '.')

    await upload
      .putObject({
        Body: file,
        Bucket: process.env.REACT_APP_BUCKET_NAME,
        Key: fileNameUpload,
        ACL: 'public-read',
      })
      .promise()

    return 'https://' + ENDPOINT_URL_IMAGE + fileNameUpload
  } catch (error) {
    console.log(error)
    return ''
  }
}

export const uploadFiles = async (files) => {
  try {
    const _d = moment(new Date()).format('YYYY/MM/DD') + '/' + uuidv4()

    if (!files) return false

    let arrayFileName = []
    const promises = files.map(async (file) => {
      let fileName = file.name.split('.')
      const fileNameUpload = _d + '/' + fileName.toString().replaceAll(',', '.')

      arrayFileName.push(fileNameUpload)

      const res = upload
        .putObject({
          Body: file,
          Bucket: process.env.REACT_APP_BUCKET_NAME,
          Key: fileNameUpload,
          ACL: 'public-read',
        })
        .promise()

      return res
    })
    await Promise.all(promises)
    let listUrl = arrayFileName.map(
      (name) => 'https://' + ENDPOINT_URL_IMAGE + name
    )
    return listUrl || false
  } catch (error) {
    console.log(error)
    return false
  }
}
