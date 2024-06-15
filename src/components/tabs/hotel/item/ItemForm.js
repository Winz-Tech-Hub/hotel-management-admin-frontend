import React, { useState, useEffect, useRef } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { ALL_ITEMCATEGORY, CREATE_ITEM } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../paginating/Spinner'
import fetcher from '../../../../scripts/SharedFetcher'
import { paginatingUrl } from '../../../../scripts/misc'
import { ACTIVE } from '../../../../scripts/config/contants'

function ItemForm(props) {
  const dataIdRef = useRef('')

  const [isUpdate, setIsUpdate] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')

  const [categories, setCategories] = useState([])

  useEffect(() => {
    ;(async () => {
      const url = paginatingUrl(ALL_ITEMCATEGORY, {
        status: ACTIVE,
      })
      let data
      try {
        data = await fetcher.fetch(url)
      } catch (er) {
        toast.error(er.message)
        return
      }
      if (data) {
        if (!data.data.status) {
          toast.error(data.data.message)
        } else {
          const d = data.data.itemCategories.results
          d && setCategories(d)
        }
      }
    })()
  }, [])

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id

      setCategory(data.category)
      setName(data.name)
      setPrice(data.price)
      setDepartment(data.department)
      setStatus(data.status)

      setIsUpdate(true)
    }
  }, [props.data])

  async function createItem(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_ITEM,
      data: {
        category: category,
        name: name,
        price,
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

  async function updateItem(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_ITEM,
      method: 'PATCH',
      data: {
        id: dataIdRef.current,

        category: category,
        name: name,
        price,
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
    <Form onSubmit={(e) => (isUpdate ? updateItem(e) : createItem(e))}>
      <Row>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Category</InputGroup.Text>
            <Form.Select required={true} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option key="first" value="">
                Select Item Category
              </option>

              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>

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
            <InputGroup.Text className="fw-bold">Name</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Name</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
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
          <Spinner loading={submitting} loadingText={`${isUpdate ? 'Updating item' : 'Creating item'}`}>
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
export default ItemForm
