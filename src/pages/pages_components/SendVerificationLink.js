/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useState } from 'react'
import { Card } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { SEND_VERIFICATION, VERIFY_MAIL } from '../../scripts/config/RestEndpoints'
import fetcher from '../../scripts/SharedFetcher'
import Spinner from '../../components/general/Spinner'

function SendVerificationLink(props) {
  const [email, setEmail] = useState(props.email)
  const [code, setCode] = useState()
  const [resend, setResend] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verified] = useState(false)

  async function verifyCode(e) {
    e.preventDefault()
    setVerifying(true)
    const postData = {
      url: VERIFY_MAIL,
      data: { email, code },
    }
    const verify = await fetcher.fetch(postData)
    if (verify?.data.status) {
      toast.success(verify.data.message)
      props.setShowModal(false)
    } else {
      toast.error(verify?.data.message)
    }
    setVerifying(false)
  }

  async function resendVerificationCode(e) {
    e.preventDefault()
    setResend(true)
    const sendVerificationMail = await fetcher.fetch(SEND_VERIFICATION + email)
    if (sendVerificationMail?.data.status) {
      toast.success(sendVerificationMail.data.message)
    } else {
      toast.error(sendVerificationMail?.data.message)
    }
    setResend(false)
  }

  return verified ? (
    <Navigate to="/login" />
  ) : (
    <>
      <Card>
        <Card.Title classsName="text-center mt-2">Verification</Card.Title>
        <Card.Body>
          <form id="formAuthentication" className="mb-3" onSubmit={(e) => verifyCode(e)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                placeholder="Email address"
                autoFocus={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="mb-2">
                <button
                  onClick={(e) => {
                    resendVerificationCode(e)
                  }}
                  className="btn btn-link"
                  disabled={resend}
                >
                  <Spinner loading={resend} loadingText="Resending" text="Resend Code" />
                </button>
              </div>
            </div>
            <div className="mb-3 form-password-toggle">
              <div className="d-flex justify-content-between ">
                <label className="form-label" htmlFor="code">
                  Confirmation Code
                </label>
              </div>
              <div className="input-group input-group-merge">
                <input
                  type={'text'}
                  id="code"
                  className="form-control"
                  name="code"
                  placeholder="Code"
                  aria-describedby="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <button className="btn btn-primary d-grid w-100" type="submit" disabled={verifying}>
                <Spinner loading={verifying} loadingText="Verifying" text="Verify" />
              </button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </>
  )
}

export default SendVerificationLink
