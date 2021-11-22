import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ACTION } from './consts'
import { clearBrowserCache } from 'utils'
import jwt_decode from 'jwt-decode'
import Loading from 'components/loading/Loading'

//views
import Views from 'views'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    clearBrowserCache()
  }, [])

  useEffect(() => {
    if (localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
      dispatch({
        type: ACTION.LOGIN,
        data: {
          accessToken: localStorage.getItem('accessToken'),
          refreshToken: localStorage.getItem('refreshToken'),
        },
      })

      const dataUser = jwt_decode(localStorage.getItem('accessToken'))
      if (dataUser)
        dispatch({
          type: 'SET_BRANCH_ID',
          data: dataUser.data.branch_id,
        })
    }
  }, [])

  return (
    <>
      <Loading />
      <Views />
    </>
  )
}

export default App
