/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-jsdoc */
import React from 'react'
import SharedConfig from '../scripts/SharedConfig'
import { Navigate } from 'react-router-dom'

export default function Refresh(props) {
  const previousPage = SharedConfig.get('previousPage')

  return <Navigate to={previousPage || '/home'} />
}
