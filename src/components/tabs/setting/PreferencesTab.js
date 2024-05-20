/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useEffect, useState } from 'react'
import fetcher from '../../../scripts/SharedFetcher'
import { ALL_USER_SETTINGS, CREATE_USER_SETTING, USER_SETTING_RESET } from '../../../scripts/config/RestEndpoints'
import { Button, Card, Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap'
import SharedConfig from '../../../scripts/SharedConfig'
import { UID } from '../../../scripts/config/contants'
import { encodeQuery } from '../../../scripts/misc'
import Spinner from '../../general/Spinner'
import { toast } from 'react-toastify'

function PreferencesTab({ style, className, category }) {
  const [submitting, setSubmitting] = useState(false)
  const [reload, setReload] = useState(false)

  const [settingsName, setSettingsName] = useState([])
  const [settings, setSettings] = useState([])

  useEffect(() => {
    const settingQuery = encodeQuery({
      uid: SharedConfig.getLocalData(UID),
    })
    fetcher.fetch(ALL_USER_SETTINGS + '?q=' + settingQuery).then((data) => {
      const settingsData = data?.data?.userSettings?.results
      resultSetter(settingsData)
    })
  }, [reload])

  function resultSetter(settingsData = []) {
    const categories = {}
    for (const userSetting of settingsData) {
      const cat = userSetting.setting.category
      if (!categories[cat.name]) {
        categories[cat.name] = []
      }
      categories[cat.name].push({
        ...userSetting.setting,
        settingSupported: userSetting?.settingSupported,
      })
    }
    const settingsNameL = Object.keys(categories)
    const settingsL = Object.values(categories)
    setSettingsName(settingsNameL)
    setSettings(settingsL)
  }

  function isBoolean(val) {
    if (typeof val === 'boolean' || (isNaN(val) && (val.toLowerCase() == 'true' || val.toLowerCase() == 'false'))) {
      return true
    }
    return false
  }

  function toBoolean(val) {
    if (!val || typeof val === 'boolean') {
      return val
    }
    if (isNaN(val)) {
      //const isTrue = val.toLowerCase() == "true";
      const isFalse = val.toLowerCase() == 'false'
      return !isFalse
    }
    return val
  }

  function saveSettings(e) {
    setSubmitting(true)
    e.preventDefault()
    const settings = []
    for (const { name, value } of e.target) {
      if (name && value)
        settings.push({
          name,
          value: isBoolean(value) ? toBoolean(value) : value,
        })
    }
    const gdFetchOption = {
      url: CREATE_USER_SETTING,
      method: 'PATCH',
      data: { settings },
    }
    fetcher
      .fetch(gdFetchOption)
      .then((data) => {
        if (data) {
          if (!data?.data?.status) {
            toast.error(data?.data?.message)
          } else {
            toast.success(data.data.message)
            setReload(!reload)
          }
          setSubmitting(false)
        }
      })
      .catch((er) => {
        toast.error(er.message)
        setSubmitting(false)
      })
  }

  function resetSettings(e) {
    e.preventDefault()
    fetcher
      .fetch(USER_SETTING_RESET)
      .then((data) => {
        if (data) {
          if (!data?.data?.status) {
            toast.error(data?.data?.message)
          } else {
            toast.success(data.data.message)
            setReload(!reload)
          }
        }
      })
      .catch((er) => {
        toast.error(er.message)
      })
  }

  return (
    <Form onSubmit={saveSettings}>
      <Card style={style || {}} className={className || ''}>
        <Card.Header className="">
          <Button size="sm" onClick={resetSettings} title="Reset">
            <i class="fas fa-redo fa-xs fa-fw"></i>
          </Button>
        </Card.Header>
        {settingsName.map((categoryName, catIndex) =>
          category && categoryName !== category ? null : (
            <Card className="utilityLink" key={catIndex}>
              <Card.Header className="py-1">{categoryName}</Card.Header>
              <Card.Body>
                <Row>
                  {settings[catIndex].map((setting, settingIndex) => (
                    <Col xs="12" sm="12" md="6" lg="6" className="p-1" key={settingIndex}>
                      <InputGroup>
                        <InputGroup.Text className="fw-bold">{setting.name} </InputGroup.Text>
                        {isBoolean(setting?.value) ? (
                          <FormSelect
                            defaultValue={setting.value}
                            name={setting.name}
                            disabled={!setting.settingSupported}
                          >
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
                            name={setting.name}
                            type={Number.parseInt(setting.value) ? 'number' : 'text'}
                            defaultValue={setting.value}
                            disabled={setting.settingSupported}
                          ></Form.Control>
                        )}
                      </InputGroup>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          ),
        )}
        <Card.Footer className="">
          <Spinner loading={submitting} loadingText={`${'Updating'}`}>
            <Button size="md" type="submit" className="fw-bold pull-right">
              Update
            </Button>
          </Spinner>
        </Card.Footer>
      </Card>
    </Form>
  )
}

export default PreferencesTab
