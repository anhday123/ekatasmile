import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ACTION } from './consts/index'
import { decodeToken } from 'react-jwt'

import Loading from 'components/loading/Loading'

//views
import Views from 'views'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (
      localStorage.getItem('accessToken') &&
      localStorage.getItem('refreshToken')
    ) {
      dispatch({
        type: ACTION.LOGIN,
        data: {
          accessToken: localStorage.getItem('accessToken'),
          refreshToken: localStorage.getItem('refreshToken'),
        },
      })

      const dataUser = decodeToken(localStorage.getItem('accessToken'))
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
