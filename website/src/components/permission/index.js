import React from 'react'
import jwt_decode from 'jwt-decode'

const Permission = ({ permissions, children, ...props }) => {
  try {
    const context =
      localStorage.getItem('accessToken') && jwt_decode(localStorage.getItem('accessToken'))

    if (!context) {
      return null
    }

    const allPermission = [...context.data._role.menu_list, ...context.data._role.permission_list]

    if (
      !permissions ||
      permissions.length === 0 ||
      permissions.filter((p) => allPermission.includes(p)).length
    ) {
      return React.cloneElement(children, props)
    }

    return null
  } catch (error) {
    return null
  }
}

export default Permission
