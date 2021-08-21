import React from 'react'
import { decodeToken } from 'react-jwt'

const Permission = ({ permissions, children, ...props }) => {
  try {
    const context =
      localStorage.getItem('accessToken') &&
      decodeToken(localStorage.getItem('accessToken'))

    if (!context) {
      return null
    }

    if (
      !permissions ||
      permissions.length === 0 ||
      permissions.filter((p) => context.data.role.menu_list.includes(p)).length
    ) {
      return React.cloneElement(children, props)
    }

    return null
  } catch (error) {
    return null
  }
}

export default Permission
