/* eslint-disable no-undef */
import React from 'react'
import Main from '../layout/Main'
import { Card, Col, Container, Nav, NavItem, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import UserTab from '../components/tabs/user/UserTab'
import UserProfileTab from '../components/tabs/user/UserProfileTab'

function User() {
  const location = useLocation()
  const tab = new URLSearchParams(location.search)?.get('tab')

  return (
    <>
      <Main>
        <Container fluid>
          <Row>
            <Col xs="12" sm="12" md="4" lg="3">
              <Card>
                <Card.Header className="mb-0 pb-0">
                  <h5>User</h5>
                </Card.Header>
                <Card.Header className="mt-0 pt-0">User and User Profile</Card.Header>
                <Card.Footer className="mt-0 pt-0 mx-1 px-1">
                  <Nav variant="pills" className="s-grid">
                    <NavItem>
                      <Link to="../user" className={`nav-link ${!tab || tab === 'user' ? 'active' : ''}`}>
                        <i className="me-1"></i> Users
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link to="../user?tab=profile" className={`nav-link ${tab === 'profile' ? 'active' : ''}`}>
                        <i className="me-1"></i> User Profiles
                      </Link>
                    </NavItem>
                  </Nav>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs="12" sm="12" md="8" lg="9" className="mt-3">
              <Card>
                <Card.Body>{tab === 'profile' ? <UserProfileTab /> : <UserTab />}</Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Main>
    </>
  )
}
export default User
