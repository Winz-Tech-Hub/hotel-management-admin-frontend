import React, { useState, useEffect, useRef } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { ALL_INVENTORY, CREATE_INVENTORY } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../paginating/Spinner'
import fetcher from '../../../../scripts/SharedFetcher'
import { paginatingUrl } from '../../../../scripts/misc'
import { ACTIVE } from '../../../../scripts/config/contants'

function InventoryForm(props) {
  const dataIdRef = useRef('')

  const [isUpdate, setIsUpdate] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  const [item, setItem] = useState('')
  const [type, setType] = useState('')
  const [state, setState] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [totalPrice, setTotalPrice] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id

      setItem(data.item)
      setType(data.type)
      setState(data.state)
      setQuantity(data.quantity)
      setUnitPrice(data.unitPrice)
      setTotalPrice(data.totalPrice)
      setStatus(data.status)

      setIsUpdate(true)
    }
  }, [props.data])

  async function createInventory(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_INVENTORY,
      data: {
        item,
        type,
        state,
        quantity,
        unitPrice,
        totalPrice,
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
        props.setData && props.setData(data.data.created)
        props.setReload && props.setReload()
        toast.success(data.data.message)
      }
    }
    setSubmitting(false)
  }

  async function updateInventory(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_INVENTORY,
      method: 'PATCH',
      data: {
        id: dataIdRef.current,

        item,
        type,
        state,
        quantity,
        unitPrice,
        totalPrice,
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
        props.setData && props.setData(data.data.created)
        props.setReload && props.setReload()
        toast.success(data.data.message)
      }
    }
    setSubmitting(false)
  }

  return (
    <Form onSubmit={(e) => (isUpdate ? updateInventory(e) : createInventory(e))}>
      <Row>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Item</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Type</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">State</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Quantity</InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Unit Price</InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Total Price</InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Status &nbsp;&nbsp;
              <Form.Switch checked={status} onChange={() => setStatus(status ? 0 : 1)}></Form.Switch>
            </InputGroup.Text>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <Spinner loading={submitting} loadingText={`${isUpdate ? 'Updating inventory' : 'Creating inventory'}`}>
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
export default InventoryForm
