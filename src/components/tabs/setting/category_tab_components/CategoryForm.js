import React, { useState, useEffect } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { CREATE_SETTING_CATEGORY } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../general/Spinner'
import { useRef } from 'react'
import fetcher from '../../../../scripts/SharedFetcher'

function CategoryForm(props) {
  const dataIdRef = useRef('')

  const [isUpdate, setIsUpdate] = useState(false)

  let [submitting, setSubmitting] = useState(false)

  let [name, setName] = useState('')

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id
      setName(data.name)
      setIsUpdate(true)
    }
  }, [props.data])

  async function createCategory(e) {
    setSubmitting(true)
    e.preventDefault()
    let gdFetchCategory = {
      url: CREATE_SETTING_CATEGORY,
      data: {
        name,
      },
    }
    let data
    try {
      data = await fetcher.fetch(gdFetchCategory)
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

  async function updateCategory(e) {
    setSubmitting(true)
    e.preventDefault()
    let gdFetchCategory = {
      url: CREATE_SETTING_CATEGORY,
      method: 'PATCH',
      data: {
        id: dataIdRef.current,
        name,
      },
    }
    let data
    try {
      data = await fetcher.fetch(gdFetchCategory)
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
    <Form onSubmit={(e) => (isUpdate ? updateCategory(e) : createCategory(e))}>
      <Row>
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
          <Spinner loading={submitting} loadingText={`${isUpdate ? 'Updating option' : 'Creating option'}`}>
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
export default CategoryForm
