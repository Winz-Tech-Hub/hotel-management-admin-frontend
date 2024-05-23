/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-jsdoc */
import React, { useState } from 'react'
import SharedConfig from '../../scripts/SharedConfig'
import { Navigate } from 'react-router-dom'

function LogOut(props) {
  const [signedIn, signout] = useState(false)

  function logout() {
    SharedConfig.destroyAll()
    signout(true)
  }
  return signedIn ? (
    <Navigate to={'/login'} />
  ) : (
    <div onClick={() => logout()} className="c-pointer s-100w-p">
      <i className="bx bx-power-off me-2"></i>
      <span className="align-middle">Log Out</span>
    </div>
  )
}

export default LogOut
