import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Spinner from '../../general/Spinner'
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap'

function Action(props) {
  const [commitMessage, setCommitMessage] = useState('')
  const [command, setCommand] = useState('')
  const [pushing, setPushing] = useState(false)
  const [commanding, setCommanding] = useState(false)
  const [commandTimeout, setCommandTimeout] = useState(30)
  const [restarting, setRestarting] = useState(false)

  function push(e) {
    e.preventDefault()
    setPushing(true)
    let option = {
      url: props.url + '/push',
      method: 'POST',
      data: {
        username: props.username,
        password: props.password,
        repo: props.repo,
        commitMessage,
      },
    }
    props.fetcher
      .fetch(option)
      .then((data) => {
        props.setOutput(data)
        setPushing(false)
      })
      .catch((error) => {
        props.setOutput(error.message)
        setPushing(false)
      })
  }

  function run(e, silentCommand) {
    e.preventDefault()
    if (!(command || silentCommand)) {
      toast.error('Empty command')
      return
    }

    silentCommand ? setRestarting(true) : setCommanding(true)
    let option = {
      url: props.url + '/run',
      method: 'POST',
      data: {
        username: props.username,
        password: props.password,
        repo: props.repo,
        command: silentCommand || command,
        commandTimeout,
      },
    }
    props.fetcher
      .fetch(option)
      .then((data) => {
        props.setOutput(data)
        silentCommand ? setRestarting(false) : setCommanding(false)
      })
      .catch((error) => {
        props.setOutput(error.message)
        silentCommand ? setRestarting(false) : setCommanding(false)
      })
  }

  return (
    <>
      <Row>
        <Form onSubmit={push}>
          <div>
            Push
            <hr className="mt-0" />
          </div>
          <Col xs="12" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">Commit</InputGroup.Text>
              <Form.Control
                type="text"
                title="Commit Message"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
              ></Form.Control>
            </InputGroup>
          </Col>

          <Col xs="12" md="6" lg="6" className="p-1 pull-right">
            <Spinner loading={pushing} loadingText="Pushing">
              <Form.Control size="md" type="submit" value="Push" className="fw-bold utilityLink"></Form.Control>
            </Spinner>
          </Col>
        </Form>
      </Row>

      <Row>
        <Form onSubmit={run}>
          <div>
            Run Command
            <hr className="mt-0" />
          </div>
          <Col xs="12" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">Command</InputGroup.Text>
              <Form.Control
                type="text"
                required
                title="Command to run not limited to git."
                value={command}
                onChange={(e) => setCommand(e.target.value)}
              ></Form.Control>
            </InputGroup>
          </Col>

          <Col xs="12" className="p-1">
            <Row>
              <Col xs="12" md="6" lg="6" className="p-1">
                <InputGroup>
                  <InputGroup.Text className="fw-bold">Timeout (S)</InputGroup.Text>
                  <Form.Control
                    type="number"
                    title="Timeout running command after specified time in seconds"
                    value={commandTimeout}
                    onChange={(e) => setCommandTimeout(e.target.value)}
                  ></Form.Control>
                </InputGroup>
              </Col>

              <Col xs="12" md="6" lg="6" className="p-1">
                <Spinner loading={commanding} loadingText="Running" className="p-1 pull-right">
                  <Form.Control
                    size="md"
                    variant="danger"
                    type="submit"
                    value="Run"
                    className="fw-bold utilityLink"
                  ></Form.Control>
                </Spinner>
              </Col>
            </Row>
          </Col>
        </Form>
      </Row>

      <Row>
        <Col xs="12" md="6" lg="6" className="p-1 pull-right">
          <Button
            size="lg"
            variant="danger"
            onClick={(e) => run(e, 'sudo systemctl restart hotel-managementMainServer')}
          >
            <Spinner loading={restarting}>Restart Main Server Service</Spinner>
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default Action
