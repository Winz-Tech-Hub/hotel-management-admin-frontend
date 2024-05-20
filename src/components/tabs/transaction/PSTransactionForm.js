/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap'
import fetcher from '../../../scripts/SharedFetcher'
import { toast } from 'react-toastify'
import { CREATE_PROFIT_TRANSACTION, CREATE_SALES_TRANSACTION } from '../../../scripts/config/RestEndpoints'
import { CHARGE, DEPOSIT, TRANSFER, WITHDRAW } from '../../../scripts/config/contants'
import Spinner from '../../general/Spinner'

function PSTransactionForm(props) {
  const dataIdRef = useRef('')

  const [submitting, setSubmitting] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)

  const [uid, setUid] = useState('')
  const [address, setAddress] = useState('')
  const [token, setToken] = useState('')
  const [actualAmount, setActualAmount] = useState('')
  const [resolvedAmount, setResolvedAmount] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id

      setUid(data?.uid?._id || data?.uid)
      setAddress(data.address)
      setToken(data.token?._id)
      setActualAmount(data.actualAmount)
      setResolvedAmount(data.resolvedAmount)
      setType(data.type)
      setDescription(data.description)
      setStatus(data.status)

      setIsUpdate(true)
    }
  }, [props.data])

  async function updatePSTransaction(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: props.form === 'profit' ? CREATE_PROFIT_TRANSACTION : CREATE_SALES_TRANSACTION,
      method: 'PATCH',
      data: {
        id: dataIdRef.current,
        uid,
        address,
        token,
        actualAmount,
        resolvedAmount,
        type,
        description,
        status,
      },
    }
    let data
    try {
      data = await fetcher.fetch(gdFetchOption)
    } catch (er) {
      toast.error(er.message)
    }
    if (data) {
      if (!data.data.status) {
        toast.error(data.data.message)
      } else {
        props.setData && props.setData(data.data.generated)
        props.setReload && props.setReload()
        setSubmitting(false)
        toast.success(data.data.message)
      }
    }
    setSubmitting(false)
  }

  async function createPSTransaction(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: props.form === 'profit' ? CREATE_PROFIT_TRANSACTION : CREATE_SALES_TRANSACTION,
      method: 'POST',
      data: {
        id: dataIdRef.current,
        uid,
        address,
        token,
        actualAmount,
        resolvedAmount,
        type,
        description,
        status,
      },
    }
    let data
    try {
      data = await fetcher.fetch(gdFetchOption)
    } catch (er) {
      toast.error(er.message)
    }
    if (data) {
      if (!data.data.status) {
        toast.error(data.data.message)
      } else {
        props.setData && props.setData(data.data.generated)
        props.setReload && props.setReload()
        setSubmitting(false)
        toast.success(data.data.message)
      }
    }
    setSubmitting(false)
  }

  return (
    <Form onSubmit={(e) => (isUpdate ? updatePSTransaction(e) : createPSTransaction(e))}>
      <Row>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">UID </InputGroup.Text>
            <Form.Control type="number" value={uid} onChange={(e) => setUid(e.target.value)}></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Address</InputGroup.Text>
            <Form.Control
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value.trim())}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Token Id</InputGroup.Text>
            <Form.Control type="text" value={token} onChange={(e) => setToken(e.target.value.trim())}></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Actual Amount &nbsp;
              <span className="text-danger" style={{ fontSize: '10px' }}>
                {props?.data?.token?.symbol}
              </span>
            </InputGroup.Text>
            <Form.Control
              type="number"
              value={actualAmount}
              step=".00000000001"
              onChange={(e) => setActualAmount(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Resolved Amount &nbsp;
              <span className="text-danger" style={{ fontSize: '10px' }}>
                USDT
              </span>
            </InputGroup.Text>
            <Form.Control
              type="number"
              value={resolvedAmount}
              step=".00000000001"
              onChange={(e) => setResolvedAmount(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Type</InputGroup.Text>
            <FormSelect onChange={(e) => setType(e.target.value)} value={type}>
              <option key={'first'} value={''}>
                Select Transaction type
              </option>
              <option key={DEPOSIT} value={DEPOSIT}>
                Deposit
              </option>
              <option key={WITHDRAW} value={WITHDRAW}>
                Withdraw
              </option>
              <option key={TRANSFER} value={TRANSFER}>
                Transfer
              </option>
              <option key={CHARGE} value={CHARGE}>
                System Charge
              </option>
            </FormSelect>
          </InputGroup>
        </Col>
        <Col xs="12" className="p-1">
          <InputGroup>
            <label className="fw-bold">Description</label>
            <textarea
              style={{ width: '100%', borderRadius: '5px' }}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            >
              {description}
            </textarea>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Status &nbsp;&nbsp;
              <Form.Switch checked={status} onChange={(e) => setStatus(status ? 0 : 1)}></Form.Switch>
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <Spinner loading={submitting} loadingText={`${isUpdate ? 'Updating' : 'Creating'} Transaction`}>
            <Form.Control
              size="md"
              type="submit"
              value={`${isUpdate ? 'Update' : 'Create'}`}
              className="fw-bold utilityLink"
            ></Form.Control>
          </Spinner>
        </Col>{' '}
      </Row>
    </Form>
  )
}
export default PSTransactionForm
