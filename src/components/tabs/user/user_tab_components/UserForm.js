/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { CREATE_USER } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../general/Spinner'
import fetcher from '../../../../scripts/SharedFetcher'
import {
  ADMIN,
  BARTENDER,
  DEVELOPER,
  KITCHEN,
  RECEPTIONIST,
  STORE_KEEPER,
  USER,
} from '../../../../scripts/config/contants'

function UserForm(props) {
  const dataIdRef = useRef('')

  const [isUpdate, setIsUpdate] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState(USER)
  const [position, setPosition] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(0)

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id
      setFirstname(data.firstname)
      setLastname(data.lastname)
      setEmail(data.email)
      setRole(data.role)
      setPhone(data.phone)
      setStatus(data.status)
      setPosition(data.position)
      //setPassword(data.password)
      setIsUpdate(true)
    }
  }, [])

  async function createUser(e) {
    setSubmitting(true)
    e.preventDefault()

    const gdFetchOption = {
      url: CREATE_USER,
      data: {
        firstname,
        lastname,
        email,
        role,
        position,
        password,
        phone,
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

  async function updateUser(e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      url: CREATE_USER,
      method: 'PATCH',
      data: {
        uid: dataIdRef.current,

        firstname,
        lastname,
        email,
        role,
        position,
        password,
        phone,
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
    <Form onSubmit={(e) => (isUpdate ? updateUser(e) : createUser(e))}>
      <Row>
        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Firstname</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value?.trim())}
            />
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Lastname</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value?.trim())}
            />
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Email </InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value?.trim()?.toLowerCase())}
            />
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Phone </InputGroup.Text>
            <Form.Control required={true} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Password </InputGroup.Text>
            <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} />
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Privilege</InputGroup.Text>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value === ADMIN ? ADMIN : USER)}>
              <option key="first" value="">
                Select privilege
              </option>
              <option key="user" value={USER}>
                Normal/Staff
              </option>
              <option key="admin" value={ADMIN}>
                Manager/Admin
              </option>
              <option key="admin" value={DEVELOPER}>
                Developer
              </option>
            </Form.Select>
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Position</InputGroup.Text>
            <Form.Select required={true} value={position} onChange={(e) => setPosition(parseInt(e.target.value))}>
              <option key="first" value="">
                Select position
              </option>
              {[
                { name: 'RECEPTIONIST', value: RECEPTIONIST },
                { name: 'BARTENDER', value: BARTENDER },
                { name: 'KITCHEN', value: KITCHEN },
                { name: 'STORE_KEEPER', value: STORE_KEEPER },
              ].map((pos) => (
                <option key={pos.name} value={pos.value}>
                  {pos.name}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>

        <Col xs="12" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Status &nbsp;&nbsp;
              <Form.Switch checked={status} onChange={(e) => setStatus(status ? 0 : 1)}></Form.Switch>
            </InputGroup.Text>
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <Spinner loading={submitting} loadingText={`${isUpdate ? 'Updating user' : 'Creating user'}`}>
            <Form.Control
              size="md"
              type="submit"
              value={`${isUpdate ? 'Update' : 'Create'}`}
              className="fw-bold utilityLink"
            />
          </Spinner>
        </Col>
      </Row>
    </Form>
  )
}
export default UserForm
