/* eslint-disable no-undef */
import React from 'react'
import Main from '../layout/Main'
import { Card, Col, Container, Nav, NavItem, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import RoleTab from '../components/tabs/role/RoleTab'

function Role() {
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
                  <h5>Role</h5>
                </Card.Header>
                <Card.Header className="mt-0 pt-0 text-danger"></Card.Header>
                <Card.Footer className="mt-0 pt-0 mx-1 px-1">
                  <Nav variant="pills" className="s-grid">
                    <NavItem>
                      <Link to="../role" className={`nav-link ${!tab || tab === 'role' ? 'active' : ''}`}>
                        <i className="fas fa-user me-1"></i> Roles
                      </Link>
                    </NavItem>
                  </Nav>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs="12" sm="12" md="8" lg="9" className="mt-3">
              <Card>
                <Card.Body>{<RoleTab />}</Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Main>
    </>
  )
}
export default Role
