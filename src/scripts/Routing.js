import React from 'react'
import { Route } from 'react-router-dom'
import routes from './config/routes.js'
import Error from '../pages/Error'
import Authenticate from '../pages/pages_components/Authenticate'

class Routing {
  constructor() {
    this.__getRoutes = (type) => {
      switch (type) {
        case this.SECURE:
          type = 'secure'
          break

        case this.INSECURE:
        default:
          type = 'insecure'
          break
      }
      this.routers = routes[type]
      this.routeComponents = this.routers.map((prop) => {
        let Component = prop.component

        return !Component ? null : (
          <Route
            path={prop.path}
            Component={(cprops) =>
              type === 'insecure' ? (
                <Error>
                  <Component {...cprops} />
                </Error>
              ) : (
                <Error>
                  <Authenticate>
                    <Component {...cprops} />
                  </Authenticate>{' '}
                </Error>
              )
            }
            key={prop.path}
          />
        )
      })
      return this.routeComponents
    }
  }

  INSECURE = 0
  SECURE = 1

  getSecuredRoutes() {
    return this.__getRoutes(this.SECURE)
  }

  getInSecuredRoutes() {
    return this.__getRoutes(this.INSECURE)
  }
}

export default Routing
