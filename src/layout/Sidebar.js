import React from 'react'

import { useLocation, Link } from 'react-router-dom'
import sidebarRoutes from './sidebarProp'
import NavToggler from './layout_components/NavToggler'
import { ThemeConsumer } from '../components/context/theme'
import { isActivePath as activeRoute } from '../scripts/misc'
import SharedConfig from '../scripts/SharedConfig'
import { SITE_TITLE } from '../scripts/config/contants'

function Sidebar() {
  const location = useLocation()

  /*  const [avatar, setFilename] = useGetDataUri("");
  const [details, setDetails] = useState({});

  useEffect(() => {
    const getProfile = async () => {
      let data = null;
      try {
        data = await fetcher.fetch(USER_DETAIL);
      } catch (er) {
        toast.error(er.message);
      }
      if (!data?.data?.status) {
        toast.error(data?.data?.message);
      } else {
        setDetails(data?.data?.user);
        setFilename(data?.data?.user?.avatar);
      }
    };
    getProfile();
  }, []); */

  return (
    <ThemeConsumer>
      {(style) => (
        <aside
          id="layout-menu"
          className="layout-menu menu-vertical menu bg-menu-theme my-2"
          style={{ maxHeight: '-webkit-fill-available' }}
        >
          <div className="app-brand demo" style={style}>
            <Link to="/" className="app-brand-link">
              <span className="app-brand-logo demo">
                <h2>{SharedConfig.getSessionData('SITE_TITLE') || SITE_TITLE}</h2>
                {/* <img src={avatar} alt="Logo" className="thumbnail" /> */}
              </span>
            </Link>

            <NavToggler>
              <i className="bx bx-chevron-left bx-sm align-middle" />
            </NavToggler>
          </div>
          <div className="menu-inner-shadow" />
          <ul className="menu-inner py-4" style={{ ...style, overflowX: 'hidden', overflowY: 'auto' }}>
            {sidebarRoutes.map((prop) => {
              if (!prop.redirect) {
                return (
                  <li className={`menu-item ${activeRoute(location, prop.path)}`} key={prop.path}>
                    <Link to={`${prop.path}`} className="menu-link">
                      <i className={`menu-icon tf-icons ${prop.icon}`} />
                      <div data-i18n={`${prop.name}`}>{prop.name}</div>
                    </Link>
                  </li>
                )
              } else return null
            })}
          </ul>
        </aside>
      )}
    </ThemeConsumer>
  )
}

export default Sidebar
