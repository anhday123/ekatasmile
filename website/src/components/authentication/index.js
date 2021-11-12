import React, { cloneElement } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'
import { notification } from 'antd'
import { decodeToken } from 'react-jwt'

/**
 *
 * @param {Object} props
 * @param {Array<String>} props.permissions
 * @param {React.ReactChildren} props.children
 */
const Authentication = ({ permissions, title, children, ...props }) => {
  const history = useHistory()
  const payload =
    localStorage.getItem('accessToken') &&
    decodeToken(localStorage.getItem('accessToken'))

  //modify title
  document.title = title

  //check đã đăng nhập chưa hoặc token còn hạn -> vào trang home
  if (!permissions) {
    if (!payload || new Date(payload.exp * 1000).getTime() < Date.now()) {
      return cloneElement(children, props)
    }
    return <Redirect to={ROUTES.OVERVIEW} />
  }

  //check login ?
  if (!payload) {
    return <Redirect to={ROUTES.LOGIN} />
  }

  const allPermission = [
    ...payload.data._role.menu_list,
    ...payload.data._role.permission_list,
  ]

  // permissions.length = 0 -> screen public
  // permissions.length > 0 -> check user có quyền truy cập vào màn hình này
  if (
    permissions.length === 0 ||
    permissions.filter((p) => allPermission.includes(p)).length > 0
  ) {
    return cloneElement(children, props)
  }

  notification.warning({
    message: 'Permission Denied',
  })

  history.goBack()

  return <div />
}

export default Authentication
