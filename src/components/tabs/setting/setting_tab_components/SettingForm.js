/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react'
import { Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { ALL_SETTING_CATEGORY, ALL_PACKAGE, CREATE_SETTING } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../general/Spinner'
import fetcher from '../../../../scripts/SharedFetcher'

function SettingForm(props) {
  const dataIdRef = useRef('')

  const [isUpdate, setIsUpdate] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [packages, setPackages] = useState([])
  const [dataType, setDataType] = useState('boolean')

  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [category, setCategory] = useState('')
  const [packageId, setPackageId] = useState('')

  useEffect(() => {
    const getCategory = async () => {
      let data = null
      try {
        data = await fetcher.fetch(ALL_SETTING_CATEGORY + '?size=500')
      } catch (er) {
        toast.error(er.message)
      }
      if (!data?.data?.status) {
        toast.error(data.data.message)
      } else {
        setCategories(data.data.settingCategories.results)
      }
    }
    getCategory()
    const getPackages = async () => {
      let data = null
      try {
        data = await fetcher.fetch(ALL_PACKAGE + '?size=500')
      } catch (er) {
        toast.error(er.message)
      }
      if (!data?.data?.status) {
        toast.error(data.data.message)
      } else {
        setPackages(data.data.packages.results)
      }
    }
    getPackages()
  }, [])

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id
      setName(data.name)
      setValue(data.value)
      setCategory(data?.category?._id)
      setPackageId(data?.packageId?._id)
      setIsUpdate(true)
    }
  }, [props.data])

  async function createSetting(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchSetting = {
      url: CREATE_SETTING,
      data: {
        name,
        value,
        category,
        packageId,
      },
    }
    let data
    try {
      data = await fetcher.fetch(gdFetchSetting)
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

  async function updateSetting(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchSetting = {
      url: CREATE_SETTING,
      method: 'PATCH',
      data: {
        id: dataIdRef.current,
        name,
        value,
        category,
        packageId,
      },
    }
    let data
    try {
      data = await fetcher.fetch(gdFetchSetting)
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
    <Form onSubmit={(e) => (isUpdate ? updateSetting(e) : createSetting(e))}>
      <Row>
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
            </FormSelect>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Package</InputGroup.Text>
            <FormSelect required={true} onChange={(e) => setPackageId(e.target.value)} value={packageId}>
              <option key={'first'} value={''}>
                Select Supported Package
              </option>
              {packages?.map((packageId) => (
                <option key={packageId._id} value={packageId._id}>
                  {packageId.name}
                </option>
              ))}
            </FormSelect>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Category</InputGroup.Text>
            <FormSelect required={true} onChange={(e) => setCategory(e.target.value)} value={category}>
              <option key={'first'} value={''}>
                Select Category
              </option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
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
            <InputGroup.Text className="fw-bold">Value</InputGroup.Text>
            {dataType === 'boolean' ? (
              <FormSelect required={true} value={value} onChange={(e) => setValue(e.target.value)}>
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
            ) : (
              <Form.Control
                required={true}
                type={dataType}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              ></Form.Control>
            )}
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <Spinner loading={submitting} loadingText={`${isUpdate ? 'Updating setting' : 'Creating setting'}`}>
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
export default SettingForm
