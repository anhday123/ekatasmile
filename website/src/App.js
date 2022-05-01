import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ACTION, ROUTES } from './consts'
import { clearBrowserCache } from 'utils'
import jwt_decode from 'jwt-decode'
import { socket } from 'socket'

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
  const domain = window.location.href
  let subDomain = domain.split(`.${process.env.REACT_APP_HOST}`)
  const token = localStorage.getItem('accessToken')

  const [loadingCheckDomain, setLoadingCheckDomain] = useState(false)

  const getBusiness = async () => {
    try {
      const res = await getBusinesses({ _business: true })
      console.log(res)
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

  if (
    (domain === `https://${process.env.REACT_APP_HOST}/` ||
      domain === `https://${process.env.REACT_APP_HOST}` ||
      domain === `${process.env.REACT_APP_HOST}/` ||
      domain === `${process.env.REACT_APP_HOST}`) &&
    subDomain &&
    subDomain.length === 1
  )
    window.location.href = `https://${process.env.REACT_APP_HOST}${ROUTES.CHECK_SUBDOMAIN}`

  const checkSubdomain = async () => {
    let router = ''

    if (domain.includes(`${process.env.REACT_APP_HOST}${ROUTES.CHECK_SUBDOMAIN}`))
      router = ROUTES.CHECK_SUBDOMAIN
    if (domain.includes(`${process.env.REACT_APP_HOST}${ROUTES.REGISTER}`)) router = ROUTES.REGISTER
    if (domain.includes(`${process.env.REACT_APP_HOST}${ROUTES.LOGIN}`)) router = ROUTES.LOGIN

    if (router === ROUTES.LOGIN) {
      setLoadingCheckDomain(true)

      if (subDomain && subDomain.length === 2) {
        subDomain = subDomain[0].split('//')

        const res = await checkDomain(subDomain[1])
        if (res.status === 200) {
          if (!res.data.success) {
            window.location.href = `https://${process.env.REACT_APP_HOST}${ROUTES.REGISTER}`
            return
          }
        } else {
          window.location.href = `https://${process.env.REACT_APP_HOST}${ROUTES.REGISTER}`
          return
        }
      } else {
        window.location.href = `https://${process.env.REACT_APP_HOST}${ROUTES.REGISTER}`
        return
      }
    }

    if (router === ROUTES.REGISTER)
      if (subDomain && subDomain.length === 2)
        window.location.href = `https://${process.env.REACT_APP_HOST}${ROUTES.REGISTER}`

    if (router === ROUTES.CHECK_SUBDOMAIN)
      if (subDomain && subDomain.length === 2)
        window.location.href = `https://${process.env.REACT_APP_HOST}${ROUTES.CHECK_SUBDOMAIN}`

    setLoadingCheckDomain(false)
  }

  const checkLogin = () => {
    if (token) {
      dispatch({ type: ACTION.LOGIN, data: { accessToken: token } })
      const dataUser = jwt_decode(token)
      if (dataUser) dispatch({ type: 'SET_BRANCH_ID', data: dataUser.data.store_id })
    }
  }

  useEffect(() => {
    if (token) {
      socket.on(
        `${dataUser.data && dataUser.data._business.prefix}#${
          dataUser && dataUser.data && dataUser.data.user_id
        }`,
        (data) => {
          console.log('socket', data)
        }
      )
    }
  }, [dataUser])

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
