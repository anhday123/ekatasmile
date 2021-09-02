import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ACTION } from './consts/index'
import { getAllStore } from './apis/store'
import { getStore } from './actions/store'

import Loading from 'components/loading/Loading'
import ModalIntro from 'components/introduction'

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
    }
  }, [])

  const getAllStoreData = async () => {
    try {
      const res = await getAllStore()
      if (res.status === 200) {
        const action = getStore(res.data.data)
        dispatch(action)
      }
    } catch (error) {}
  }

  useEffect(() => {
    getAllStoreData()
  }, [])

  return (
    <>
      <Loading />
      <ModalIntro />
      <Views />
    </>
  )
}

export default App
