import React, { useEffect } from 'react'

import { ROUTES } from 'consts'
import { notification } from 'antd'
import { getAllBranch } from 'apis/branch'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function NotificationCreateBranch() {
  const history = useHistory()
  const key = 'notiCreateBranch'
  const visible = useSelector((state) => state.modal.visibleNotiCreateBranch)

  const config = {
    key,
    message: 'Bạn chưa có chi nhánh',
    description: (
      <a
        onClick={() => {
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

  const geBranchByUser = async () => {
    try {
      const res = await getAllBranch()
      if (res.status === 200) {
        if (!res.data.data.length) {
          notification.warning(config)
        } else notification.close(key)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    geBranchByUser()
  }, [visible])

  return <div />
}
