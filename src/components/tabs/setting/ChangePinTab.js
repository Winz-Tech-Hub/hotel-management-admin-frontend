/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { CHANGE_PIN } from '../../../scripts/config/RestEndpoints'
import { useGetDataUri } from '../../../scripts/hooks/hookCollection'
import fetcher from '../../../scripts/SharedFetcher'
import { Button, Col, Row } from 'react-bootstrap'
import Spinner from '../../paginating/Spinner'
import SharedConfig from '../../../scripts/SharedConfig'
import { UID } from '../../../scripts/config/contants'
import { encodeQuery } from '../../../scripts/misc'

function ChangePinTab({ style, className }) {
  const [submitting, setSubmitting] = useState(false)

  const [oldPin, setOldPin] = useState('')
  const [pin, setPin] = useState('')
  const [password, setPassword] = useState('')

  async function updateChangePin(e) {
    setSubmitting(true)
    e.preventDefault()

    let gdFetchOption = {
      url: CHANGE_PIN,
      method: 'POST',
      data: {
        uid: SharedConfig.getLocalData(UID),
        pin,
        oldPin,
        password,
      },
    }
    fetcher
      .fetch(gdFetchOption)
      .then((data) => {
        if (data) {
          if (!data?.data?.status) {
            toast.error(data?.data?.message)
          } else {
            toast.success(data.data.message)
          }
          setSubmitting(false)
        }
      })
      .catch((er) => {
        toast.error(er.message)
        setSubmitting(false)
      })
  }

  return (
    <form onSubmit={updateChangePin}>
      <div className={(className || '') + ''} style={style || {}}>
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Edit ChangePin</h4>
          </div>
          <div className="card-body">
            <div className="row mt-2">
              <div className="col-md-6 px-1">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 px-1">
                <div className="form-group">
                  <label>Old Pin</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Old Pin or empty if first change"
                    value={oldPin}
                    onChange={(e) => setOldPin(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 px-1">
                <div className="form-group">
                  <label>New Pin</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="New Pin"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <Row>
              <Col xs="12" sm="4" md="4" lg="4" className="p-1 pull-right">
                <Spinner loading={submitting} loadingText={`${'Updating'}`}>
                  <Button size="md" type="submit" className="fw-bold">
                    Update
                  </Button>
                </Spinner>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </form>
  )
}

export default ChangePinTab
