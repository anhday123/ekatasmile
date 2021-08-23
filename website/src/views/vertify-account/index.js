import { ROUTES } from 'consts'
import React, { useEffect } from 'react'

import { useLocation, useHistory } from 'react-router'
import { checkUID } from 'apis/uid'
import { notification } from 'antd'

export default function VertifyAccount() {
  const location = useLocation()
  const history = useHistory()

  const checkUid = async (uid) => {
    try {
      const res = await checkUID({ UID: uid })
      if (res.status === 200) {
        history.push({
          pathname: ROUTES.OTP,
          state: { username: res.data.username, action: 'REGISTER' },
        })
      } else {
        history.push(ROUTES.LOGIN)
        notification.error({
          message: res.data.message
            ? 'Link không tồn tại!!!'
            : 'Xác thực tài khoản có lỗi, vui lòng thử lại!!!',
        })
      }
    } catch (error) {
      history.push(ROUTES.LOGIN)
      console.log(error)
    }
  }

  useEffect(() => {
    const uid = new URLSearchParams(location.search).get('uid')
    if (!uid) history.push(ROUTES.LOGIN)
    else checkUid(uid)
    checkUid()
  }, [])

  return <div />
}
