/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { ALL_COUNTRIE, ALL_STATE, COUNTRIE, CREATE_USER, USER_DETAIL } from '../../../scripts/config/RestEndpoints'
import { useGetDataUri } from '../../../scripts/hooks/hookCollection'
import fetcher from '../../../scripts/SharedFetcher'
import { Button, Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap'
import Spinner from '../../general/Spinner'
import SharedConfig from '../../../scripts/SharedConfig'
import { UID } from '../../../scripts/config/contants'
import { encodeQuery } from '../../../scripts/misc'

function ProfileTab({ style, className }) {
  const [submitting, setSubmitting] = useState(false)

  const [avatarData, setFilename] = useGetDataUri()
  const [details, setDetails] = useState({})
  const [countryInfo, setCountryInfo] = useState({})

  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState(null)

  const fileInputRef = useRef(null)

  useEffect(() => {
    const getProfile = async () => {
      let data = null
      try {
        data = await fetcher.fetch(USER_DETAIL)
      } catch (er) {
        toast.error(er.message)
      }
      if (!data?.data?.status) {
        toast.error(data?.data?.message)
      } else {
        const det = data?.data?.user
        setDetails(det)
        data?.data?.user?.avatar && setFilename(det?.avatar)
        setFirstname(det?.firstname)
        setLastname(det?.lastname)
        setEmail(det?.email)
        setState(det?.state)
        setCountry(det?.country)
        setPhone(det?.phone)
        setBio(det?.bio)
      }
    }
    getProfile()
  }, [])

  useEffect(() => {
    if (country) {
      const stateQuery = encodeQuery({
        country_id: country,
      })
      fetcher.fetch(ALL_STATE + '?size=500&q=' + stateQuery).then((data) => {
        setStates(data?.data?.states?.results)
      })
      fetcher.fetch(COUNTRIE + country).then((data) => {
        setCountryInfo(data?.data?.countrie)
      })
    }
  }, [country])

  useEffect(() => {
    fetcher.fetch(ALL_COUNTRIE + '?size=500').then((data) => {
      setCountries(data?.data?.countries?.results)
    })
  }, [])

  async function updateProfile(e) {
    setSubmitting(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('uid', SharedConfig.getLocalData(UID))
    email !== details.email && formData.append('email', email)
    country !== details.country && formData.append('country', country)
    state !== details.state && formData.append('state', state)
    bio !== details.bio && formData.append('bio', bio?.trim())
    phone !== details.phone && formData.append('phone', phone)
    avatar && formData.append('avatar', avatar)

    let gdFetchOption = {
      url: CREATE_USER,
      method: 'PATCH',
      data: formData,
    }
    avatar &&
      avatar instanceof Object &&
      (gdFetchOption.headers = {
        'Content-Type': 'multipart/form-data',
      })
    fetcher
      .fetch(gdFetchOption)
      .then((data) => {
        if (data) {
          if (!data?.data?.status) {
            toast.error(data?.data?.message)
          } else {
            toast.success(data.data.message)
          }
          setSubmitting(false)
        }
      })
      .catch((er) => {
        toast.error(er.message)
        setSubmitting(false)
      })
  }

  return (
    <form onSubmit={updateProfile}>
      <div className={(className || '') + 'row'} style={style || {}}>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Edit Profile</h4>
            </div>
            <div className="card-body">
              <div className="row mt-2">
                <div className="col-12 px-1">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6 px-1">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6 px-1">
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last Name"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-4 px-1">
                  <div className="form-group">
                    <label>Country</label>
                    <FormSelect
                      required={state && state !== '' ? true : false}
                      onChange={(e) => setCountry(e.target.value)}
                      value={country}
                    >
                      <option key={'first'} value={''}>
                        Select Country
                      </option>
                      {countries?.map((countrie) => (
                        <option key={countrie.id} value={countrie.id}>
                          {countrie.emoji} {countrie.name}
                        </option>
                      ))}
                    </FormSelect>
                  </div>
                </div>
                <div className="col-md-4 px-1">
                  <div className="form-group">
                    <label>State</label>
                    <FormSelect
                      required={country && country !== '' ? true : false}
                      onChange={(e) => setState(e.target.value)}
                      value={state}
                    >
                      <option key={'first'} value={''}>
                        Select State
                      </option>
                      {states?.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                    </FormSelect>
                  </div>
                </div>
                <div className="col-md-4 px-1">
                  <div className="form-group">
                    <label>Phone</label>
                    <InputGroup>
                      <InputGroup.Text className="fw-bold">{countryInfo?.phonecode}</InputGroup.Text>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>About Me</label>
                    <textarea style={{ width: '100%' }} value={bio} onChange={(e) => setBio(e.target.value)}>
                      {bio}
                    </textarea>
                  </div>
                </div>
              </div>
              <Row>
                <Col xs="12" sm="4" md="4" lg="4" className="p-1 pull-right">
                  <Spinner loading={submitting} loadingText={`${'Updating'}`}>
                    <Button size="md" type="submit" className="fw-bold">
                      Update
                    </Button>
                  </Spinner>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className="col-md-4 pt-2">
          <div className="card card-user">
            <div className="card-image">
              <img src={avatarData} alt={'image'} style={{ width: '100%' }} />
            </div>
            <div className="card-body">
              <div className="author rounded-circle">
                <a href="/">
                  <img className="avatar border-gray" src={avatarData} alt={'image'} />
                  <h5 className="title">{firstname + ' ' + lastname}</h5>
                </a>
                <p className="bio">{email}</p>
              </div>
              <p className="bio text-center text-italic">{bio}</p>
            </div>
            <hr />
            <div className="">
              <Form.Control
                ref={fileInputRef}
                style={{ display: 'none' }}
                type="file"
                //value={avatar}
                onChange={(e) => setAvatar(e.target.files[0])}
              ></Form.Control>
              <p className="c-pointer utilityLink text-center" onClick={() => fileInputRef.current.click()}>
                Change Avatar
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default ProfileTab
