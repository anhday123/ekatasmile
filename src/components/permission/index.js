import React from "react";
import { decodeJWT } from "utils";

const Permission = ({ permissions, children, ...props }) => {
  try {
    const context =
      localStorage.getItem('accessToken') &&
      decodeJWT(localStorage.getItem('accessToken'))

    if (!context) {
      return null
    }

    if (
      !permissions ||
      permissions.length === 0 ||
      permissions.filter((p) => context.permission.includes(p))
        .length
    ) {
      return React.cloneElement(children, props)
    }

    return null
  } catch (error) {

    return null
  }
}

export default Permission
