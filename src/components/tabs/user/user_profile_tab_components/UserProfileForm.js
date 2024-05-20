import React, { useState, useEffect, useRef } from 'react'
import { Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap'
import fetcher from '../../../../scripts/SharedFetcher'
import { toast } from 'react-toastify'
import { ALL_COUNTRIE, ALL_STATE } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../general/Spinner'
import { encodeQuery } from '../../../../scripts/misc'

function UserProfileForm(props) {
  const dataIdRef = useRef('')

  const [submitting, setSubmitting] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)

  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])

  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    const getCountries = async () => {
      let data = null
      try {
        data = await fetcher.fetch(ALL_COUNTRIE + '?size=500')
      } catch (er) {
        toast.error(er.message)
      }
      if (!data?.data?.status) {
        toast.error(data.data.message)
      } else {
        setCountries(data?.data?.countries?.results)
      }
    }
    getCountries()
  }, [])

  useEffect(() => {
    const getStates = async () => {
      const stateQuery = encodeQuery({
        country_id: country,
      })
      let data = null
      try {
        data = await fetcher.fetch(ALL_STATE + '?size=500&q=' + stateQuery)
      } catch (er) {
        toast.error(er.message)
      }
      if (!data?.data?.status) {
        toast.error(data.data.message)
      } else {
        setStates(data?.data?.states?.results)
      }
    }
    getStates()
  }, [country])

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data.uid
      setCountry(data.country)
      setState(data.state)
      setBio(data.bio)
      setAvatar(data.avatar)
      setIsUpdate(true)
    }
  }, [props.data])

  async function updateUserProfile(e) {
    setSubmitting(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('uid', dataIdRef.current)
    country && formData.append('country', country)
    state && formData.append('state', state)
    bio && formData.append('bio', bio?.trim())
    avatar && formData.append('avatar', avatar)

    let gdFetchOption = {
      url: '/user-profile',
      method: 'PATCH',
      data: formData,
    }
    avatar &&
      avatar instanceof Object &&
      (gdFetchOption.headers = {
        'Content-Type': 'multipart/form-data',
      })
    let data
    try {
      data = await fetcher.fetch(gdFetchOption)
    } catch (er) {
      toast.error(er.message)
    }
    if (data) {
      if (!data?.data?.status) {
        toast.error(data?.data?.message || 'Error')
      } else {
        props.setData && props.setData(data.data.generated)
        props.setReload && props.setReload()
        setSubmitting(false)
        toast.success(data.data.message)
      }
    }
    setSubmitting(false)
  }

  return (
    <Form onSubmit={(e) => (isUpdate ? updateUserProfile(e) : null)}>
      <Row>
        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Country</InputGroup.Text>
            <FormSelect
              required={state && state !== '' ? true : false}
              onChange={(e) => setCountry(e.target.value)}
              value={country}
            >
              <option key={'first'} value={''}>
                Select Your Country
              </option>
              {countries?.map((countrie) => (
                <option key={countrie.id} value={countrie.id}>
                  {countrie.name}
                </option>
              ))}
            </FormSelect>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">State</InputGroup.Text>
            <FormSelect
              required={country && country !== '' ? true : false}
              onChange={(e) => setState(e.target.value)}
              value={state}
            >
              <option key={'first'} value={''}>
                Select Your State
              </option>
              {states?.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </FormSelect>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" className="p-1">
          <InputGroup>
            <label className="fw-bold">Bio</label>
            <textarea style={{ width: '100%' }} value={bio} onChange={(e) => setBio(e.target.value)}>
              {bio}
            </textarea>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Avatar </InputGroup.Text>
            <Form.Control
              type="file"
              //value={avatar}
              onChange={(e) => setAvatar(e.target.files[0])}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="6" className="p-1">
          <Spinner loading={submitting} loadingText={`${isUpdate ? 'Updating' : 'Creating'} user profile`}>
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
export default UserProfileForm
