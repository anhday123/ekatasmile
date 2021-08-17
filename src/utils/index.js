export const decodeJWT = (_token) => {
  if (typeof _token !== 'string') {
    return false
  }
  const _splitToken = _token.split('.')
  if (_splitToken.length !== 3) {
    return false
  }
  try {
    const payload = JSON.parse(atob(_splitToken[1]))
    // if (payload.role === 'client') {
    //   if (!payload.permissions) {
    //     payload.permissions = []
    //   }
    //   payload.permissions = [
    //     ...payload.permissions,
    //   ]
    // }
    return payload
  } catch (error) {
    return null
  }
}
