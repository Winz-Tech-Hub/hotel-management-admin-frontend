/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { UID } from '../../../../scripts/config/contants'
import { CONFIRM_USER, TRANSFER } from '../../../../scripts/config/RestEndpoints'
import SharedConfig from '../../../../scripts/SharedConfig'
import fetcher from '../../../../scripts/SharedFetcher'
import ModalBox from '../../../general/Modal'
import Spinner from '../../../general/Spinner'

function FundingForm(props) {
  const [fetchingUser, setFetchingUser] = useState(false)
  const [found, setFound] = useState(false)
  const [makingTransfer, setMakingTransfer] = useState(false)

  const [emailOrID, setEmailOrID] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [charge, setCharge] = useState(false)
  const [user, setUser] = useState({})

  async function fetchUser(e) {
    setFetchingUser(true)
    e.preventDefault()
    let data
    try {
      data = await fetcher.fetch(CONFIRM_USER + emailOrID)
    } catch (er) {
      toast.error(er.message)
    }
    if (data) {
      if (!data.data.status) {
        toast.error(data.data.message)
      } else {
        setUser(data.data.user)
        setFound(true)
      }
    }
    setFetchingUser(false)
  }

  function makeTransfer(e) {
    setMakingTransfer(true)
    e.preventDefault()
    const uid = SharedConfig.getSessionData(UID)
    let fData = {
      url: TRANSFER,
      data: {
        fromUid: uid,
        toUid: user._id,
        description,
        charge,
        iAmAdminTransferFromMyAccount: !!charge,
        amount,
      },
    }
    fetcher
      .fetch(fData)
      .then((data) => {
        if (data) {
          if (!data.data.status) {
            toast.error(data.data.message)
          } else {
            toast.success(data.data.message)
            setFound(false)
          }
        }
        setMakingTransfer(false)
      })
      .catch((error) => {
        toast.error(error.message)
        setMakingTransfer(false)
      })
  }

  return (
    <>
      <ModalBox
        show={found}
        onCancel={() => setFound(false)}
        control={false}
        header={<h1 className="text-center">{user.firstname + ' ' + user.lastname}</h1>}
        backdrop
      >
        <Form onSubmit={(e) => makeTransfer(e)}>
          <Row>
            <Col xs="12" sm="12" className="p-1">
              <InputGroup>
                <InputGroup.Text className="fw-bold">Amount</InputGroup.Text>
                <Form.Control
                  required={true}
                  isValid={amount > 0 && amount < 10000}
                  id="amount"
                  name="amount"
                  size="md"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value?.trim())}
                ></Form.Control>
                <InputGroup.Text>
                  <Button className="utilityLink" type="submit" disabled={makingTransfer}>
                    Fund
                  </Button>
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
        </Form>
      </ModalBox>
      <Form onSubmit={(e) => fetchUser(e)}>
        <Row>
          <Col xs="12" sm="12" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">EUID </InputGroup.Text>
              <Form.Control
                required={true}
                type="text"
                placeholder="example@gmail.com OR an ID"
                title="Enter receiver's email address OR UID"
                value={emailOrID}
                onChange={(e) => setEmailOrID(e.target.value)}
              ></Form.Control>
            </InputGroup>
          </Col>

          <Col xs="12" className="p-1">
            <InputGroup>
              <label className="fw-bold">Description</label>
              <textarea
                required={true}
                style={{ width: '100%', borderRadius: '5px' }}
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              >
                {description}
              </textarea>
            </InputGroup>
          </Col>

          <Col xs="12" sm="6" md="6" lg="6" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">
                System Charge &nbsp;&nbsp;
                <Form.Switch checked={charge} onChange={(e) => setCharge(!charge)}></Form.Switch>
              </InputGroup.Text>
            </InputGroup>
          </Col>

          <Col xs="12" sm="6" md="6" lg="6" className="p-1">
            <Spinner loading={fetchingUser}>
              <Button className="utilityLink" type="submit">
                Confirm
              </Button>
            </Spinner>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default FundingForm
