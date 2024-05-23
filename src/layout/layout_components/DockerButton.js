/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

function DockerButton({ active, path, name, icon, scroll }) {
  let location = useLocation()
  let anchorRef = useRef()
  async function s() {
    return new Promise((resolve, reject) => {
      anchorRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
      setTimeout(() => {
        return resolve()
      }, 1000)
    })
  }
  useEffect(() => {
    if (active !== '') {
      s().then(
        (msg) => (document.documentElement.scrollTop = 0),
        (msg) => alert(msg),
      )
    }
  }, [location, active])
  return (
    <Link to={path} className={`btn ${active}`} ref={anchorRef}>
      <i className={`text-center ${icon} fa-lg`} />
      <div className=" text-nowrap" data-i18n={`${name}`}>
        {name}
      </div>
    </Link>
  )
}

export default DockerButton
