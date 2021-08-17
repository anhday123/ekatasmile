import axios from 'axios'

export const uploadImg = (formData) =>
    axios.post(
        'https://ecom-fulfill.com/api/fileupload/single',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

export const uploadImgs = (formData) =>
    axios.post(
        'https://ecom-fulfill.com/api/fileupload/multi',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )