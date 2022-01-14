import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ACTION } from './consts'
import { clearBrowserCache } from 'utils'
import jwt_decode from 'jwt-decode'

//components
import Views from 'views'
import Loading from 'components/loading/Loading'
import LoadingCheckDomain from 'views/loading'

//apis
import { checkDomain } from 'apis/app'
import { getBusinesses } from 'apis/business'

function App() {
  const dispatch = useDispatch()
  const dataUser = useSelector((state) => state.login.dataUser)

  const [loadingCheckDomain, setLoadingCheckDomain] = useState(false)

  const getBusiness = async () => {
    try {
      const res = await getBusinesses({ _business: true })
      if (res.status === 200)
        if (res.data.data)
          if (localStorage.getItem('accessToken')) {
            const dataUser = jwt_decode(localStorage.getItem('accessToken'))
            if (dataUser && dataUser.data) {
              const business = res.data.data.find(
                (e) =>
                  e._business && e._business.business_name === dataUser.data._business.business_name
              )

              if (business) {
                document.querySelector("link[rel*='icon']").href = business._business
                  ? business._business.company_logo
                  : ''
                dispatch({ type: 'GET_SETTING_APP', data: business._business || {} })
              }
            }
          }
    } catch (error) {
      console.log(error)
    }
  }

  const checkSubdomain = async () => {
    const domain = window.location.href

    // check domain register
    if (!domain.includes('vdropship.vn/register')) {
      setLoadingCheckDomain(true)

      let subDomain = domain.split('.vdropship.vn')
      subDomain = subDomain[0].split('//')

      //Khi code comment lại, code xong để lại như cũ
      const res = await checkDomain(subDomain[1])
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
        } else {
          window.location.href = 'https://vdropship.vn/register'
          return
        }
      } else {
        window.location.href = 'https://vdropship.vn/register'
        return
      }
    }

    setLoadingCheckDomain(false)
  }

  const checkLogin = () => {
    if (localStorage.getItem('accessToken')) {
      dispatch({ type: ACTION.LOGIN, data: { accessToken: localStorage.getItem('accessToken') } })
      const dataUser = jwt_decode(localStorage.getItem('accessToken'))
      if (dataUser) dispatch({ type: 'SET_BRANCH_ID', data: dataUser.data.branch_id })
    }
  }

  useEffect(() => {
    getBusiness()
  }, [dataUser])

  useEffect(() => {
    checkLogin()
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
