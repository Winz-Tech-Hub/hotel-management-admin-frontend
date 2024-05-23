import React, { useState, useEffect, useRef } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { CREATE_ROOMCATEGORY } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../paginating/Spinner'
import fetcher from '../../../../scripts/SharedFetcher'

function RoomCategoryForm(props) {
  const dataIdRef = useRef('')

  const [isUpdate, setIsUpdate] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id

      setName(data.name)
      setDescription(data.description)
      setPrice(data.price)
      setStatus(data.status)

      setIsUpdate(true)
    }
  }, [props.data])

  async function createRoomCategory(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_ROOMCATEGORY,
      data: {
        name,
        description,
        price,
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

  async function updateRoomCategory(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_ROOMCATEGORY,
      method: 'PATCH',
      data: {
        id: dataIdRef.current,

        name,
        description,
        price,
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
    <Form onSubmit={(e) => (isUpdate ? updateRoomCategory(e) : createRoomCategory(e))}>
      <Row>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
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

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Description</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Price</InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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

        <Col xs="12" className="p-1">
          <Spinner
            loading={submitting}
            loadingText={`${isUpdate ? 'Updating room category' : 'Creating room category'}`}
          >
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
export default RoomCategoryForm
