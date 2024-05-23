/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import { Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { CREATE_OPTION } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../paginating/Spinner'
import fetcher from '../../../../scripts/SharedFetcher'

function OptionForm(props) {
  const dataIdRef = useRef('')

  const [isUpdate, setIsUpdate] = useState(false)

  const [dataType, setDataType] = useState('boolean')

  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id
      setName(data.name)
      setValue(data.value)
      setDescription(data.description)
      setIsPublic(data.isPublic)
      setIsUpdate(true)
    }
  }, [props.data])

  async function createOption(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_OPTION,
      data: {
        name,
        value,
        description,
        isPublic,
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

  async function updateOption(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_OPTION,
      method: 'PATCH',
      data: {
        id: dataIdRef.current,
        name,
        value,
        description,
        isPublic,
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
    <Form onSubmit={(e) => (isUpdate ? updateOption(e) : createOption(e))}>
      <Row>
        <Col xs="12" sm="12" className="p-1">
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
            <InputGroup.Text className="fw-bold">Data Types</InputGroup.Text>
            <FormSelect value={dataType} onChange={(e) => setDataType(e.target.value)}>
              <option key={'first'} value={''}>
                Select Data Type
              </option>
              <option key={'boolean'} value={'boolean'}>
                Boolean
              </option>
              <option key={'number'} value={'number'}>
                Number
              </option>
              <option key={'text'} value={'text'}>
                Text
              </option>
              <option key={'text-area'} value={'text-area'}>
                Text Area
              </option>
            </FormSelect>
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <InputGroup>
            {dataType === 'boolean' ? (
              <>
                <InputGroup.Text className="fw-bold">Value</InputGroup.Text>
                <FormSelect value={value} onChange={(e) => setValue(e.target.value)}>
                  <option key={'first'} value={''}>
                    Select
                  </option>
                  <option key={'true'} value={true}>
                    True
                  </option>
                  <option key={'false'} value={false}>
                    False
                  </option>
                </FormSelect>
              </>
            ) : dataType === 'text-area' ? (
              <>
                <Form.Label className="fw-bold">Value</Form.Label>
                <textarea
                  className="form-control summernote"
                  style={{ width: '100%' }}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                >
                  {value}
                </textarea>
              </>
            ) : (
              <>
                <InputGroup.Text className="fw-bold">Value</InputGroup.Text>
                <Form.Control
                  required={true}
                  type={dataType}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                ></Form.Control>
              </>
            )}
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <Form.Label className="fw-bold">Description</Form.Label>
          <textarea
            className="form-control summernote"
            style={{ width: '100%' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          >
            {value}
            {description}
          </textarea>
        </Col>

        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Is Public &nbsp;
              <Form.Switch checked={isPublic} onChange={(e) => setIsPublic(!isPublic)}></Form.Switch>
            </InputGroup.Text>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <Spinner loading={submitting} loadingText={`${isUpdate ? 'Updating option' : 'Creating option'}`}>
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
export default OptionForm
