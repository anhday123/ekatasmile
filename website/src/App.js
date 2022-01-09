import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ACTION } from './consts'
import { clearBrowserCache } from 'utils'
import jwt_decode from 'jwt-decode'

//components
import Views from 'views'
import Loading from 'components/loading/Loading'
import LoadingCheckDomain from 'views/loading'

//apis
import { checkDomain } from 'apis/app'

function App() {
  const dispatch = useDispatch()
  const [loadingCheckDomain, setLoadingCheckDomain] = useState(false)

  const checkSubdomain = async () => {
    const domain = window.location.href

    // check domain register
    if (!domain.includes('vdropship.vn/register')) {
      setLoadingCheckDomain(true)

      let subDomain = domain.split('.vdropship.vn')
      subDomain = subDomain[0].split('//')

      // const res = await checkDomain(subDomain[1])
      // console.log(res)
      // if (res.status === 200) {
      //   if (res.data.success) {
      //   } else window.location.href = 'https://vdropship.vn/register'
      // } else window.location.href = 'https://vdropship.vn/register'
    }

    setLoadingCheckDomain(false)
  }

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch({
        type: ACTION.LOGIN,
        data: { accessToken: localStorage.getItem('accessToken') },
      })

      const dataUser = jwt_decode(localStorage.getItem('accessToken'))
      if (dataUser) dispatch({ type: 'SET_BRANCH_ID', data: dataUser.data.branch_id })
    }
  }, [])

  useEffect(() => {
    checkSubdomain()
    clearBrowserCache()
  }, [])

  return loadingCheckDomain ? (
    <LoadingCheckDomain />
  ) : (
    <>
      <Loading />
      <Views />
    </>
  )
}

export default App
