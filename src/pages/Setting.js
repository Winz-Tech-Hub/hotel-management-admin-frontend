/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import Main from '../layout/Main'
import { Card, Col, Container, Nav, NavItem, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import CategoryTab from '../components/tabs/setting/CategoryTab'
import SettingTab from '../components/tabs/setting/SettingTab'

function Setting(__props) {
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
                  <h5>Settings</h5>
                </Card.Header>
                <Card.Footer className="mt-0 pt-0 mx-1 px-1">
                  <Nav variant="pills" className="s-grid">
                    <NavItem>
                      <Link
                        to="../setting?tab=settings"
                        className={`nav-link ${!tab || tab === 'settings' ? 'active' : ''}`}
                      >
                        <i className="fas fa-gear me-1"></i> Settings
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link
                        to="../setting?tab=categories"
                        className={`nav-link ${tab === 'categories' ? 'active' : ''}`}
                      >
                        <i className="fas fa-user-gear me-1"></i> Categories
                      </Link>
                    </NavItem>
                  </Nav>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs="12" sm="12" md="8" lg="9" className="mt-3">
              <Card>
                <Card.Body>{tab === 'categories' ? <CategoryTab /> : <SettingTab />}</Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Main>
    </>
  )
}
export default Setting
