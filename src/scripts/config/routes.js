import Dashboard from '../../pages/Dashboard'
import Git from '../../pages/Git'
import Hotel from '../../pages/Hotel'
import Log from '../../pages/Log'
import Migration from '../../pages/Migration'
import Option from '../../pages/Option'
import Refresh from '../../pages/Refresh'
import User from '../../pages/User'

const routes = {
  insecure: [],
  secure: [
    {
      path: '/home',
      component: Dashboard,
    },
    {
      path: '/user',
      component: User,
    },
    {
      path: '/option',
      component: Option,
    },
    {
      path: '/log',
      component: Log,
    },
    {
      path: '/refresh',
      component: Refresh,
    },
    {
      path: '/git',
      component: Git,
    },
    {
      path: '/migration',
      component: Migration,
    },
    {
      path: '/hotel',
      component: Hotel,
    },
  ],
}

export default routes
