import moment from 'moment'
import S3 from 'aws-s3'

export const uploadFiles = async (files) => {
  try {
    /* config s3 */
    const _d = moment(new Date()).format('YYYY/MM/DD')
    const config = {
      bucketName: process.env.REACT_APP_BUCKET_NAME,
      region: process.env.REACT_APP_REGION,
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    }
    /* config s3 */

    const listPromise = files.map(async (file) => {
      const ReactS3Client = new S3(config)
      let fileName = file.name.split('.')

      //check type file và thay đổi type file
      //check đuôi file là gì thì set type trong object file giá trị đó
      Object.defineProperty(file, 'type', {
        value: `application/${fileName[fileName.length - 1]}`,
        writable: true,
      })

      fileName.splice(fileName.length - 1, 1)

      const res = await ReactS3Client.uploadFile(
        file,
        _d + '/' + fileName.toString().replaceAll(',', '.')
      )
      if (res && res.status === 204) return res.location
    })

    const results = Promise.all(listPromise)
    return results || []
  } catch (error) {
    console.log(error)
  }
}

export const uploadFile = async (file) => {
  try {
    /* config s3 */
    const _d = moment(new Date()).format('YYYY/MM/DD')
    const config = {
      bucketName: process.env.REACT_APP_BUCKET_NAME,
      region: process.env.REACT_APP_REGION,
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    }
    /* config s3 */

    const ReactS3Client = new S3(config)
    let fileName = file.name.split('.')

    //check type file và thay đổi type file
    //check đuôi file là gì thì set type trong object file giá trị đó
    Object.defineProperty(file, 'type', {
      value: `application/${fileName[fileName.length - 1]}`,
      writable: true,
    })

    fileName.splice(fileName.length - 1, 1)

    const res = await ReactS3Client.uploadFile(
      file,
      _d + '/' + fileName.toString().replaceAll(',', '.')
    )

    if (res && res.status === 204) return res.location
    return ''
  } catch (error) {
    console.log(error)
  }
}
