import React, { useState, useEffect, useRef } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { CREATE_ITEMDISPENSE } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../paginating/Spinner'
import fetcher from '../../../../scripts/SharedFetcher'

function ItemDispenseForm(props) {
  const dataIdRef = useRef('')

  const [isUpdate, setIsUpdate] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  const [fromStaff, setfromStaff] = useState('')
  const [toStaff, settoStaff] = useState('')
  const [item, setitem] = useState('')
  const [quantity, setquantity] = useState('')
  const [amount, setamount] = useState('')
  const [department, setdepartment] = useState('')

  const [status, setStatus] = useState('')

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id

      setfromStaff(data?.fromStaff?._id)
      settoStaff(data?.toStaff?._id)
      setitem(data?.item?._id)
      setquantity(data.quantity)
      setamount(data.amount)
      setdepartment(data.department)

      setStatus(data.status)

      setIsUpdate(true)
    }
  }, [props.data])

  async function createItemDispense(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_ITEMDISPENSE,
      data: {
        fromStaff,
        toStaff,
        item,
        quantity,
        amount,
        department,

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

  async function updateItemDispense(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_ITEMDISPENSE,
      method: 'PATCH',
      data: {
        id: dataIdRef.current,

        fromStaff,
        toStaff,
        item,
        quantity,
        amount,
        department,

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
    <Form onSubmit={(e) => (isUpdate ? updateItemDispense(e) : createItemDispense(e))}>
      <Row>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">From staff Id</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={fromStaff}
              onChange={(e) => setfromStaff(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">To Staff Id</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={toStaff}
              onChange={(e) => settoStaff(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Item Id</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={item}
              onChange={(e) => setitem(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Quantity</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={quantity}
              onChange={(e) => setquantity(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Amount</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={amount}
              onChange={(e) => setamount(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Department</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={department}
              onChange={(e) => setdepartment(e.target.value)}
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
          <Spinner loading={submitting} loadingText={`${isUpdate ? 'Updating itemDispense' : 'Creating itemDispense'}`}>
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
export default ItemDispenseForm
