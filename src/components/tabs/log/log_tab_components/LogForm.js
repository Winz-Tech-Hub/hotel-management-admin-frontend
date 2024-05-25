/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { CREATE_LOG } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../paginating/Spinner'
import fetcher from '../../../../scripts/SharedFetcher'

function LogForm(props) {
  const dataIdRef = useRef('')

  const [isUpdate, setIsUpdate] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  const [model, setModel] = useState('')
  const [dataId, setDataId] = useState('')
  const [staff, setStaff] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState(1)

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id
      setModel(data.model)
      setDataId(data.dataId)
      setStaff(data.staff)
      setDescription(data.description)
      setStatus(data.status)

      setIsUpdate(true)
    }
  }, [props.data])

  async function createLog(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchLog = {
      url: CREATE_LOG,
      data: {
        model,
        dataId,
        staff,
        description,
        status,
      },
    }
    let data
    try {
      data = await fetcher.fetch(gdFetchLog)
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

  async function updateLog(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchLog = {
      url: CREATE_LOG,
      method: 'PATCH',
      data: {
        id: dataIdRef.current,

        model,
        dataId,
        staff,
        description,
        status,
      },
    }
    let data
    try {
      data = await fetcher.fetch(gdFetchLog)
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
    <Form onSubmit={(e) => (isUpdate ? updateLog(e) : createLog(e))}>
      <Row>
        <Col xs="12" sm="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Model</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Data Id</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={dataId}
              onChange={(e) => setDataId(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Staff Id</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" className="p-1">
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
            <InputGroup.Text className="fw-bold">
              Status &nbsp;&nbsp;
              <Form.Switch checked={status} onChange={() => setStatus(status ? 0 : 1)}></Form.Switch>
            </InputGroup.Text>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <Spinner loading={submitting} loadingText={`${isUpdate ? 'Updating log' : 'Creating log'}`}>
            <Form.Control
              size="md"
              type="submit"
              value={`${isUpdate ? 'Update' : 'Create'}`}
              description={`${isUpdate ? 'Update' : 'Create'}`}
              className="fw-bold utilityLink"
            ></Form.Control>
          </Spinner>
        </Col>
      </Row>
    </Form>
  )
}
export default LogForm
