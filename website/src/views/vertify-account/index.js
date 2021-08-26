import { ROUTES } from 'consts'
import React, { useEffect } from 'react'

import { useLocation, useHistory } from 'react-router'
import { checkUID } from 'apis/uid'
import { notification, Row, Col } from 'antd'

export default function VertifyAccount() {
  const location = useLocation()
  const history = useHistory()

  const checkUid = async (uid) => {
    try {
      const res = await checkUID({ UID: uid })
      console.log(res)
      if (res.status === 200) {
        history.push({
          pathname: ROUTES.OTP,
          state: { username: res.data.data.username, action: 'REGISTER' },
        })
      } else {
        history.push(ROUTES.LOGIN)
        notification.error({
          message: res.data.message || 'Link không tồn tại!!!',
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
  }, [])

  return (
    <div>
      <Row justify="center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{
            margin: 'auto',
            background: 'rgb(255, 255, 255)',
            display: 'block',
            shapeRendering: 'auto',
          }}
          width="150px"
          height="150px"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <circle cx="30" cy="50" fill="#e90c59" r="20">
            <animate
              attributeName="cx"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;0.5;1"
              values="30;70;30"
              begin="-0.5s"
            ></animate>
          </circle>
          <circle cx="70" cy="50" fill="#46dff0" r="20">
            <animate
              attributeName="cx"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;0.5;1"
              values="30;70;30"
              begin="0s"
            ></animate>
          </circle>
          <circle cx="30" cy="50" fill="#e90c59" r="20">
            <animate
              attributeName="cx"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;0.5;1"
              values="30;70;30"
              begin="-0.5s"
            ></animate>
            <animate
              attributeName="fill-opacity"
              values="0;0;1;1"
              calcMode="discrete"
              keyTimes="0;0.499;0.5;1"
              dur="1s"
              repeatCount="indefinite"
            ></animate>
          </circle>
        </svg>
      </Row>
      <Row justify="center">
        <Col>
          <div style={{ textAlign: 'center' }}>
            Đang xác thực link, vui lòng đợi chút!!!
          </div>
        </Col>
      </Row>
    </div>
  )
}
