/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* !

=========================================================
* Light Bootstrap Dashboard React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavToggler from './layout_components/NavToggler.js'
import { ThemeConsumer } from '../components/context/theme.js'
import LogOut from '../pages/pages_components/LogOut.js'
import fetcher from '../scripts/SharedFetcher'
import { USER_DETAIL } from '../scripts/config/RestEndpoints'
import { toast } from 'react-toastify'
import { useGetDataUri } from '../scripts/hooks/hookCollection'

function Header(props) {
  const [avatar, setFilename] = useGetDataUri()
  const [details, setDetails] = useState({})

  useEffect(() => {
    const getProfile = async () => {
      let data = null
      try {
        data = await fetcher.fetch(USER_DETAIL)
      } catch (er) {
        toast.error(er.message)
      }
      if (!data?.data?.status) {
        toast.error(data?.data?.message)
      } else {
        setDetails(data?.data?.user)
        data?.data?.user?.avatar && setFilename(data?.data?.user?.avatar)
      }
    }
    getProfile()
  }, [])

  return (
    <ThemeConsumer>
      {(style) => (
        <div
          style={{
            width: '100%',
          }}
        >
          <nav
            className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
            id="layout-navbar"
            style={style}
          >
            <NavToggler>
              <span href="/" className="nav-item nav-link px-0 me-xl-4">
                <i className="bx bx-menu bx-sm"></i>
              </span>
            </NavToggler>

            <div className="navbar-nav-right align-items-center row" id="navbar-collapse">
              <div className="navbar-nav align-items-center col-10">
                <div className="nav-item d-flex align-items-center s-100w-p"></div>
              </div>
              <ul className="navbar-nav flex-row align-items-center col-2">
                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                  <Link className="nav-link dropdown-toggle hide-arrow" to="/" data-bs-toggle="dropdown">
                    <div className="avatar avatar-online">
                      <img
                        src={avatar || '../assets/img/avatars/1.png'}
                        alt="Avatar"
                        className="w-px-40 h-auto rounded-circle"
                      />
                    </div>
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/setting">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar avatar-online">
                              <img
                                src={avatar || '../assets/img/avatars/1.png'}
                                alt="Avatar"
                                className="w-px-40 h-auto rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <span className="fw-semibold d-block">
                              {details?.firstname}&nbsp;{details?.lastname}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <div className="dropdown-divider"></div>
                    </li>
                    {/*  <li>
                      <Link className="dropdown-item" to="/license">
                        <i className="fas fa-rocket me-2"></i>
                        <span className="align-middle">Upgrade</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/setting?tab=preferences"
                      >
                        <i className="bx bx-cog me-2"></i>
                        <span className="align-middle">Settings</span>
                      </Link>
                    </li> */}
                    {/* <li>
                      <Link className="dropdown-item" to="/">
                        <span className="d-flex align-items-center align-middle">
                          <i className="flex-shrink-0 bx bx-credit-card me-2"></i>
                          <span className="flex-grow-1 align-middle">
                            Billing
                          </span>
                          <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">
                            4
                          </span>
                        </span>
                      </Link>
                    </li> */}
                    <li>
                      <div className="dropdown-divider"></div>
                    </li>
                    <li>
                      <div className="dropdown-item">
                        <LogOut />
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      )}
    </ThemeConsumer>
  )
}

export default Header
