import React, { useState, useEffect, useRef } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { CREATE_PREDICTIONCATEGORY } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../paginating/Spinner'
import fetcher from '../../../../scripts/SharedFetcher'

function PredictionCategoryForm(props) {
  const dataIdRef = useRef('')

  const [isUpdate, setIsUpdate] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [groupPosition, setGroupPosition] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id

      setGroupName(data.groupName)
      setGroupDescription(data.groupDescription)
      setGroupPosition(data.groupPosition)
      setStatus(data.status)

      setIsUpdate(true)
    }
  }, [props.data])

  async function createPredictionCategory(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_PREDICTIONCATEGORY,
      data: {
        groupName,
        groupDescription,
        groupPosition,
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
        toast.success(data.data.message)
      }
    }
    setSubmitting(false)
  }

  async function updatePredictionCategory(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_PREDICTIONCATEGORY,
      method: 'PATCH',
      data: {
        id: dataIdRef.current,

        groupName,
        groupDescription,
        groupPosition,
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
        toast.success(data.data.message)
      }
    }
    setSubmitting(false)
  }

  return (
    <Form onSubmit={(e) => (isUpdate ? updatePredictionCategory(e) : createPredictionCategory(e))}>
      <Row>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Name</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Label</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Position</InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={groupPosition}
              onChange={(e) => setGroupPosition(e.target.value)}
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
            loadingText={`${isUpdate ? 'Updating prediction category' : 'Creating prediction category'}`}
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
export default PredictionCategoryForm
