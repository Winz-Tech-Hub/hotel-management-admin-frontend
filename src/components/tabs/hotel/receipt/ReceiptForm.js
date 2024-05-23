import React, { useState, useEffect, useRef } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { CREATE_RECEIPT } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../paginating/Spinner'
import fetcher from '../../../../scripts/SharedFetcher'

function ReceiptForm(props) {
  const dataIdRef = useRef('')

  const [isUpdate, setIsUpdate] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  const [customer, setCustomer] = useState('')
  const [staff, setStaff] = useState('')
  const [roomCategory, setRoomCategory] = useState('')
  const [room, setRoom] = useState('')
  const [amount, setAmount] = useState('')
  const [discount, setDiscount] = useState('')
  const [checkedOut, setCheckedOut] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [duration, setDuration] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const [status, setStatus] = useState('')

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id

      setCustomer(data.customer?._id)
      setStaff(data.staff?._id)
      setRoomCategory(data.roomCategory?._id)
      setRoom(data.room?._id)
      setAmount(data.amount)
      setDiscount(data.discount)
      setCheckedOut(data.checkedOut)
      setCheckInDate(data.checkInDate.date)
      setCheckOutDate(data.checkOutDate.date)
      setDuration(data.duration)
      setPaymentMethod(data.paymentMethod)
      setStatus(data.status)

      setIsUpdate(true)
    }
  }, [props.data])

  async function createReceipt(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_RECEIPT,
      data: {
        customer,
        staff,
        roomCategory,
        room,
        amount,
        discount,
        checkedOut: !!checkedOut,
        'checkInDate.date': checkInDate,
        'checkOutDate.date': checkOutDate,
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

  async function updateReceipt(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_RECEIPT,
      method: 'PATCH',
      data: {
        id: dataIdRef.current,

        customer,
        staff,
        roomCategory,
        room,
        amount,
        discount,
        checkedOut: !!checkedOut,
        'checkInDate.date': checkInDate,
        'checkOutDate.date': checkOutDate,
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
    <Form onSubmit={(e) => (isUpdate ? updateReceipt(e) : createReceipt(e))}>
      <Row>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Customer</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Staff</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Room Category</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={roomCategory}
              onChange={(e) => setRoomCategory(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Room</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Amount</InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Discount</InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Checked Out</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={checkedOut}
              onChange={(e) => setCheckedOut(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Check In Date</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Duration</InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Payment Method</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
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
          <Spinner loading={submitting} loadingText={`${isUpdate ? 'Updating receipt' : 'Creating receipt'}`}>
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
export default ReceiptForm
