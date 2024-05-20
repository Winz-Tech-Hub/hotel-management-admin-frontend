import React from 'react'
import { useLocation } from 'react-router-dom'
import { isActivePath as activeRoute } from '../../scripts/misc'
import dashboardRoutes from '../sidebarProp'
import DockerButton from './DockerButton'

function Docker({ ...props }) {
  const location = useLocation()
  return (
    <div
      className="btn-group btn-group-sm docker mt-2"
      style={{
        ...props.style,
        overflowX: 'scroll',
        position: 'fixed',
        bottom: '0',
        width: '100%',
      }}
    >
      {dashboardRoutes.map((prop) => {
        if (!prop.redirect) {
          return <DockerButton active={activeRoute(location, prop.path)} {...prop} key={prop.path} />
        } else return null
      })}
    </div>
  )
}

export default Docker
