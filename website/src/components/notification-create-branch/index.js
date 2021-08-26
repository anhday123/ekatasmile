import React, { useEffect } from 'react'

import { ROUTES } from 'consts'
import { notification } from 'antd'
import { getAllBranch } from 'apis/branch'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

export default function NotificationCreateBranch() {
  const history = useHistory()
  const dispatch = useDispatch()
  const key = 'notiCreateBranch'
  const visible = useSelector((state) => state.modal.visibleNotiCreateBranch)
  const dataUser = useSelector((state) => state.login.dataUser)

  const config = {
    key,
    message: 'Bạn chưa có chi nhánh',
    description: (
      <a
        onClick={() => {
          dispatch({ type: 'SHOW_MODAL_NOTI_CREATE_BRANCH', data: false })
          history.push({
            pathname: ROUTES.BRANCH,
            state: { isHaveBranch: false },
          })
        }}
      >
        Nhấn vào đây để tạo chi nhánh
      </a>
    ),
    duration: 0,
    placement: 'bottomLeft',
  }

  //check user da co branch chua
  const _getAllBranch = async () => {
    try {
      const res = await getAllBranch()
      if (res.status === 200) {
        if (
          !res.data.data.length &&
          Object.keys(dataUser).length &&
          !dataUser.data.is_new
        )
          dispatch({ type: 'SHOW_MODAL_NOTI_CREATE_BRANCH', data: true })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getAllBranch()
  }, [])

  useEffect(() => {
    if (visible) {
      notification.warning(config)
    } else notification.close(key)
  }, [visible])

  return <div />
}
