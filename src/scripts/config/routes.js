import Dashboard from '../../pages/Dashboard'
import Git from '../../pages/Git'
import Hotel from '../../pages/Hotel'
import Migration from '../../pages/Migration'
import Option from '../../pages/Option'
import Refresh from '../../pages/Refresh'
import Role from '../../pages/Role'
import Setting from '../../pages/Setting'
import Transaction from '../../pages/Transaction'
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
      path: '/setting',
      component: Setting,
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
      path: '/role',
      component: Role,
    },
    {
      path: '/hotel',
      component: Hotel,
    },
    {
      path: '/transaction',
      component: Transaction,
    },
  ],
}

export default routes
