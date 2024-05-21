/* eslint-disable require-jsdoc */
import React, { useEffect, useState } from 'react'
import SharedConfig from '../../scripts/SharedConfig'
import fetcher from '../../scripts/SharedFetcher'
import { UID } from '../../scripts/config/contants'
import { LOGIN } from '../../scripts/config/RestEndpoints'
import Login from '../Login'

function Authenticate({ children }) {
  const [active, setActive] = useState(hasActiveSession())

  useEffect(() => {
    const isActive = hasActiveSession()
    if (isActive && isActive !== active) {
      setActive(isActive)
    }
  })

  async function authenticate(email, password, session = true) {
    const authData = { url: LOGIN, data: { email, password } }
    const returns = {
      status: false,
      message: 'Error',
      code: 0,
    }
    const data = await fetcher.fetch(authData)
    if (data) {
      if (data.data.status) {
        if (session) {
          SharedConfig.setSessionData(UID, data.connection.uid)
          SharedConfig.setSessionData('auth', data.data.token)
          SharedConfig.setSessionData('auth_time', btoa(`${Date.now()}`))
        }
        returns.status = true
      }
    }
    returns.message = data?.data?.message || 'Error'
    returns.code = data?.connection?.errorCode
    return returns
  }

  function hasActiveSession() {
    const uid = SharedConfig.getSessionData(UID)
    const auth = SharedConfig.getSessionData('auth')
    const authTime = SharedConfig.getSessionData('auth_time')
    const authTimeD = authTime && atob(authTime)
    const authTimeDiff = authTimeD && Date.now() - authTimeD
    const day30 = 1000 * 60 * 60 * 24 * 30
    const isActive = uid && auth && auth.trim().length !== 0 && authTimeDiff && authTimeDiff < day30
    return isActive
  }

  return <>{active ? children : <Login setActive={setActive} authenticate={authenticate} />}</>
}

export default Authenticate
