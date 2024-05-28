/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-jsdoc */
import React, { useState } from 'react'
import { Card } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import Spinner from '../components/general/Spinner'
import SharedConfig from '../scripts/SharedConfig'

function Login({ setActive = () => {}, authenticate = () => {} }) {
  const [showPassword, setShowing] = useState(false)
  const [logging, setLogging] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function togglePassword(e) {
    setShowing((previous) => !previous)
  }

  async function login(e) {
    setLogging(true)
    e.preventDefault()
    const data = {
      email,
      password,
    }
    let returns
    try {
      returns = await authenticate(data.email, data.password)
    } catch (error) {
      toast.error(error.message)
      setLogging(false)
      return
    }
    if (!returns?.status) {
      toast.error(returns?.message || 'Error')
    } else {
      setActive(true)
    }
    setLogging(false)
  }

  return (
    <>
      <ToastContainer newestOnTop={true} toastStyle={{ borderRadius: 20, paddding: 5 }} />
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="text-center my-3">
            <img
              src={SharedConfig.getSessionData('SITE_FAVICON') || '/favicon.ico'}
              height="100"
              width="100"
              alt={SharedConfig.getSessionData('SITE_TITLE')}
            />
            <div className="text-center text-red fw-bold text-uppercase">Admin</div>
          </div>
          <Card>
            <Card.Body>
              <form className="mb-3" onSubmit={login}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 form-password-toggle">
                  <div className="d-flex justify-content-between">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                  </div>
                  <div className="input-group input-group-merge">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span className="input-group-text cursor-pointer">
                      <i
                        className={`bx bx-${showPassword ? 'show' : 'hide'}`}
                        onClick={(e) => {
                          togglePassword(e)
                        }}
                      ></i>
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <button className="btn btn-primary d-grid w-100" type="submit" disabled={logging}>
                    <Spinner loading={logging} loadingText="Logging in ..." text="Sign in" />
                  </button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Login
