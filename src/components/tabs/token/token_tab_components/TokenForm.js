import React, { useState, useEffect } from 'react'
import { Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { ALL_NETWORK, CREATE_TOKEN } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../general/Spinner'
import { useRef } from 'react'
import fetcher from '../../../../scripts/SharedFetcher'

function TokenForm(props) {
  const dataIdRef = useRef('')

  const [isUpdate, setIsUpdate] = useState(false)

  let [submitting, setSubmitting] = useState(false)
  let [networks, setNetworks] = useState([])
  let [networkId, setNetworkId] = useState('')
  let [symbol, setSymbol] = useState('')
  let [name, setName] = useState('')
  let [value, setValue] = useState(null)

  useEffect(() => {
    const getNetworks = async () => {
      let data = null
      try {
        data = await fetcher.fetch(ALL_NETWORK + '?size=500')
      } catch (er) {
        toast.error(er.message)
      }
      if (!data?.data?.status) {
        toast.error(data.data.message)
      } else {
        setNetworks(data.data.networks.results)
      }
    }
    getNetworks()
  }, [])

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id
      setNetworkId(data.network)
      setSymbol(data.symbol)
      setName(data.name)
      setValue(data.value)
      setIsUpdate(true)
    }
  }, [props.data])

  async function createToken(e) {
    setSubmitting(true)
    e.preventDefault()
    if (value <= 0) {
      toast.error('Value not accepted')
    } else {
      let gdFetchOption = {
        url: CREATE_TOKEN,
        data: {
          network: networkId,
          name: name,
          symbol: symbol,
          value: value,
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
          toast.success(data.data.message)
        }
      }
    }
    setSubmitting(false)
  }

  async function updateToken(e) {
    setSubmitting(true)
    e.preventDefault()
    if (value <= 0) {
      toast.error('Value not accepted')
    } else {
      let gdFetchOption = {
        url: CREATE_TOKEN,
        method: 'PATCH',
        data: {
          id: dataIdRef.current,
          network: networkId,
          name: name,
          symbol: symbol,
          value: value,
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
          toast.success(data.data.message)
        }
      }
    }
    setSubmitting(false)
  }

  return (
    <Form onSubmit={(e) => (isUpdate ? updateToken(e) : createToken(e))}>
      <Row>
        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Network</InputGroup.Text>
            <FormSelect required={true} onChange={(e) => setNetworkId(e.target.value)} value={networkId}>
              <option key={'first'} value={''}>
                Select Network
              </option>
              {networks?.map((network) => (
                <option key={network._id} value={network._id}>
                  {network.name}
                </option>
              ))}
            </FormSelect>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Name</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Symbol</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value?.trim().toUpperCase())}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Value &nbsp; <i className="fas fa-dollar-sign text-danger"></i>
            </InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={value}
              step=".00000000001"
              onChange={(e) => setValue(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <Spinner loading={submitting} loadingText={`${isUpdate ? 'Updating token' : 'Creating token'}`}>
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
export default TokenForm
