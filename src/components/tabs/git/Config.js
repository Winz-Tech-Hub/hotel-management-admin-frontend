import React, { useState } from 'react'
import { Col, InputGroup, Row, Form } from 'react-bootstrap'
import Spinner from '../../general/Spinner'

function Config(props) {
  const [submitting, setSubmitting] = useState(false)
  const [configuring, setConfiguring] = useState(false)
  const [key, setKey] = useState('/home/admin/.ssh/id_ed25519')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [base, setbase] = useState('')
  const [parentPath, setparentPath] = useState('')
  const [removeRepo, setremoveRepo] = useState('')

  function setCredential(e) {
    e.preventDefault()
    setSubmitting(true)
    let option = {
      url: props.url + '/credential',
      method: 'POST',
      data: {
        githubKeyFile: key,
        repo: props.repo,
        username: props.username,
        password: props.password,
        newUsername: username,
        newPassword: password,
      },
    }

    props.fetcher
      .fetch(option)
      .then((data) => {
        props.setOutput(data)
        setSubmitting(false)
      })
      .catch((error) => {
        props.setOutput(error.message)
        setSubmitting(false)
      })
  }

  function setConfig(e) {
    e.preventDefault()
    setConfiguring(true)
    let option = {
      url: props.url + '/config',
      method: 'POST',
      data: {
        username: props.username,
        password: props.password,
        base,
        parentPath,
        repo: props.repo,
        removeRepo,
      },
    }
    props.fetcher
      .fetch(option)
      .then((data) => {
        props.setOutput(data)
        setConfiguring(false)
      })
      .catch((error) => {
        props.setOutput(error.message)
        setConfiguring(false)
      })
  }

  return (
    <>
      <Row>
        <Form onSubmit={setCredential}>
          <div>
            Credential
            <hr className="mt-0" />
          </div>
          <Col xs="12" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">Git Key</InputGroup.Text>
              <Form.Control
                type="text"
                title="Absolute path to key for remote operations"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              ></Form.Control>
            </InputGroup>
          </Col>

          <Col xs="12" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">New Username</InputGroup.Text>
              <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)}></Form.Control>
            </InputGroup>
          </Col>

          <Col xs="12" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">New Password</InputGroup.Text>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </InputGroup>
          </Col>

          <Col xs="12" md="6" lg="6" className="p-1 pull-right">
            <Spinner loading={submitting} loadingText="Saving">
              <Form.Control size="md" type="submit" value="Save" className="fw-bold utilityLink"></Form.Control>
            </Spinner>
          </Col>
        </Form>
      </Row>

      <Row>
        <Form onSubmit={setConfig}>
          <div>
            Configuration
            <hr className="mt-0" />
          </div>
          <Col xs="12" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">Base Path</InputGroup.Text>
              <Form.Control
                type="text"
                title="Set absolute base path for all repos"
                value={base}
                onChange={(e) => setbase(e.target.value)}
              ></Form.Control>
            </InputGroup>
          </Col>

          <Col xs="12" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">Parent Path</InputGroup.Text>
              <Form.Control
                type="text"
                title="Set absolute base path for a repo"
                value={parentPath}
                onChange={(e) => setparentPath(e.target.value)}
              ></Form.Control>
            </InputGroup>
          </Col>

          <Col xs="12" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">Repo Name(Rm)</InputGroup.Text>
              <Form.Control
                type="text"
                title="Repo name to remove it parent path"
                value={removeRepo}
                onChange={(e) => setremoveRepo(e.target.value)}
              ></Form.Control>
            </InputGroup>
          </Col>

          <Col xs="12" md="6" lg="6" className="p-1 pull-right">
            <Spinner loading={configuring} loadingText="Saving">
              <Form.Control size="md" type="submit" value="Save" className="fw-bold utilityLink"></Form.Control>
            </Spinner>
          </Col>
        </Form>
      </Row>
    </>
  )
}

export default Config
