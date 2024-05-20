import React, { useEffect, useRef, useState } from 'react'
import { Alert as BAlert, Col, Row } from 'react-bootstrap'
import SharedConfig from '../../scripts/SharedConfig'
import { deserialize, serialize } from 'react-serialize/lib'

function Alert(props) {
  const [show, setShow] = useState(true)
  const timeoutId = useRef(null)
  const sharedCountRemoved = useRef(false)
  const top = useRef(1)
  useEffect(() => {
    if (show && !props.inline) {
      top.current = (SharedConfig.increment('active-alert') + 1) * 10
    }
  }, [show])

  useEffect(() => {
    return () => {
      if (!sharedCountRemoved.current && !props.inline) {
        SharedConfig.decrement('active-alert')
      }
    }
  }, [])

  useEffect(() => {
    setShow(props.show)
    if (props.autoDismiss && props.show) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
      timeoutId.current = setTimeout(() => {
        onClose()
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }, props.timeout * 1000)
    }
  }, [props.show, props.variant])

  function onClose() {
    setShow(false)
    props.onClose && props.onClose()
    if (!props.inline) {
      SharedConfig.decrement('active-alert')
      sharedCountRemoved.current = true
    }
  }

  let alert = (
    <BAlert
      show={true}
      variant={`${props.variant || props.type}`}
      onClose={() => {
        onClose()
      }}
      dismissible={props.dismissible}
      className={`${!show ? 'no-display' : 'displaying'}`}
      style={
        !props.inline
          ? {
              position: 'fixed',
              top: `${top.current}px`,
              zIndex: 10000,
              float: 'right',
            }
          : {}
      }
    >
      <Row>
        <Col xs="3" style={{ maxWidth: '50px' }}>
          <i className={`${props.icon} font-xxlg`}></i>
        </Col>
        <Col xs="9" style={{ maxWidth: '400px' }}>
          <div>{props.children}</div>
        </Col>
      </Row>
    </BAlert>
  )

  return props.inline ? (
    alert
  ) : (
    <Col xs="12" sm="12" md={{ span: 5, offset: 7 }} lg={{ span: 4, offset: 8 }}>
      {alert}
    </Col>
  )
}

Alert.defaultProps = {
  type: 'success',
  icon: 'fas fa-bell',
  dismissible: true,
  autoDismiss: false,
  timeout: 10,
}

export const useAlert = () => {
  let [alerts, setAlerts] = useState(null)
  let [show, setShow] = useState(true)
  let alertIntervalId = SharedConfig.getSessionData('alertIntervalId')
  if (!alertIntervalId) {
    let newAlertIntervalId = setInterval(() => {
      let atemp = alert()
      if (atemp) {
        setAlerts(atemp)
        setShow(true)
      }
    }, 5000)
    SharedConfig.set('alertIntervalId', newAlertIntervalId)
  }
  return [alerts, setAlerts, show, setShow]
}

export const addAlert = (message = 'Error', variant = 'danger', autoDismiss = true) => {
  let saveOption = {
    variant: variant,
    message: message,
    autoDismiss: autoDismiss,
  }
  if (message instanceof Object) {
    saveOption.message = serialize(message)
  }
  SharedConfig.setFlashData('alert', saveOption)
}

export const alert = () => {
  let alert = SharedConfig.getSessionDataFlashData('alert')
  let jalert
  try {
    if (alert && !(alert instanceof Object)) {
      jalert = JSON.parse(alert)
    }
  } catch (error) {}
  try {
    if (jalert) {
      let deserialized = deserialize(jalert.message)
      if (deserialized) {
        jalert.message = deserialized
      }
    } else if (alert && alert instanceof Object) {
      let deserialized = deserialize(alert.message)
      if (deserialized) {
        alert.message = deserialized
      }
    }
  } catch (error) {}

  return jalert ? jalert : alert ? alert : null
}
export default Alert
