/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import { Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap'
import fetcher from '../../../../scripts/SharedFetcher'
import { toast } from 'react-toastify'
import { ALL_TOKEN, CREATE_TRANSACTION_TOKEN } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../general/Spinner'
import { encodeQuery } from '../../../../scripts/misc'

function TransactionTokenForm(props) {
  const dataIdRef = useRef('')

  const [submitting, setSubmitting] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [tokens, setTokens] = useState([])

  const [selectedTokenNetwork, setSelectedTokenNetwork] = useState(null)

  const [token, setToken] = useState('')

  const [forDeposit, setForDeposit] = useState(false)
  const [depositMin, setDepositMin] = useState(0.1)
  const [depositMax, setDepositMax] = useState(1_000_000)

  const [forWithdraw, setForWithdraw] = useState(false)
  const [withdrawMin, setWithdrawMin] = useState(0.1)
  const [withdrawMax, setWithdrawMax] = useState(1_000_000)

  const [address, setAddress] = useState('')
  const [status, setStatus] = useState(true)

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id
      setToken(data.token)
      setForDeposit(data.forDeposit)
      setDepositMin(data.depositMin)
      setDepositMax(data.depositMax)
      setForWithdraw(data.forWithdraw)
      setWithdrawMin(data.withdrawMin)
      setWithdrawMax(data.withdrawMax)
      setAddress(data.address)
      setStatus(data.status)
      setIsUpdate(true)
    }
  }, [props.data])

  useEffect(() => {
    if (token) {
      const query = encodeQuery({
        _id: token,
        populate: ['network'],
      })
      fetcher.fetch(ALL_TOKEN + '?size=500&q=' + query).then((data) => {
        setSelectedTokenNetwork(data?.data?.tokens?.results[0]?.network || null)
      })
    }
  }, [token])

  useEffect(() => {
    const getTokens = async () => {
      let data = null
      try {
        data = await fetcher.fetch(ALL_TOKEN + '?size=500')
      } catch (er) {
        toast.error(er.message)
      }
      if (!data?.data?.status) {
        toast.error(data.data.message)
      } else {
        setTokens(data.data.tokens.results)
      }
    }
    getTokens()
  }, [])

  async function createToken(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_TRANSACTION_TOKEN,
      data: {
        token,
        forDeposit,
        depositMin,
        depositMax,
        forWithdraw,
        withdrawMin,
        withdrawMax,
        address,
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

  async function updateToken(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_TRANSACTION_TOKEN,
      method: 'PATCH',
      data: {
        id: dataIdRef.current,
        token,
        forDeposit,
        depositMin,
        depositMax,
        forWithdraw,
        withdrawMin,
        withdrawMax,
        address,
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
    <Form onSubmit={(e) => (isUpdate ? updateToken(e) : createToken(e))}>
      <Row>
        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Token</InputGroup.Text>
            <FormSelect required={true} onChange={(e) => setToken(e.target.value)} value={token}>
              <option key={'first'} value={''}>
                Select token
              </option>
              {tokens?.map((token) => (
                <option key={token._id} value={token._id}>
                  {token.name}
                </option>
              ))}
            </FormSelect>
            <InputGroup.Text className="fw-bold">{selectedTokenNetwork?.name}</InputGroup.Text>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Address</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value.trim())}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Deposit Min &nbsp;
              <i className="fas fa-dollar-sign text-danger"></i>
            </InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={depositMin}
              step=".00000000001"
              onChange={(e) => setDepositMin(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Deposit Max &nbsp;
              <i className="fas fa-dollar-sign text-danger"></i>
            </InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={depositMax}
              step=".00000000001"
              onChange={(e) => setDepositMax(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Withdrawal Min &nbsp;
              <i className="fas fa-dollar-sign text-danger"></i>
            </InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={withdrawMin}
              step=".00000000001"
              onChange={(e) => setWithdrawMin(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Withdrawal Max &nbsp;
              <i className="fas fa-dollar-sign text-danger"></i>
            </InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={withdrawMax}
              step=".00000000001"
              onChange={(e) => setWithdrawMax(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col sm="4" md="4" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              For Deposit &nbsp;&nbsp;
              <Form.Switch checked={forDeposit} onChange={(e) => setForDeposit(!forDeposit)}></Form.Switch>
            </InputGroup.Text>
          </InputGroup>
        </Col>

        <Col sm="4" md="4" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              For Withdraw &nbsp;&nbsp;
              <Form.Switch checked={forWithdraw} onChange={(e) => setForWithdraw(!forWithdraw)}></Form.Switch>
            </InputGroup.Text>
          </InputGroup>
        </Col>

        <Col sm="4" md="4" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Status &nbsp;&nbsp;
              <Form.Switch checked={status} onChange={(e) => setStatus(status ? 0 : 1)}></Form.Switch>
            </InputGroup.Text>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <Spinner loading={submitting} loadingText={`${isUpdate ? 'Updating' : 'Creating'} transaction token`}>
            <Form.Control
              size="md"
              type="submit"
              value={`${isUpdate ? 'Update' : 'Create'}`}
              className="fw-bold utilityLink"
            ></Form.Control>
          </Spinner>
        </Col>
      </Row>
    </Form>
  )
}
export default TransactionTokenForm
