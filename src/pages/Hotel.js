import React from 'react'
import Main from '../layout/Main'
import { Card, Col, Container, Nav, Row } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import NItem from './pages_components/NItem'
import Reciept from '../components/tabs/hotel/Reciept'
import Customer from '../components/tabs/hotel/Customer'
import Room from '../components/tabs/hotel/Room'
import RoomCategory from '../components/tabs/hotel/RoomCategory'
import Inventory from '../components/tabs/hotel/Inventory'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Hotel(__props) {
  const location = useLocation()
  // eslint-disable-next-line no-undef
  const tab = new URLSearchParams(location.search)?.get('tab')

  return (
    <>
      <Main>
        <Container fluid>
          <Row>
            <Col xs="12" sm="12" md="4" lg="3">
              <Card>
                <Card.Header className="mb-0 pb-0">
                  <h5>Hotel</h5>
                </Card.Header>
                <Card.Footer className="mt-0 pt-0 mx-1 px-1">
                  <Nav variant="pills" className="s-grid">
                    <NItem
                      to="../hotel?tab=reciept"
                      active={!tab || tab === 'reciept'}
                      label="Reciept"
                      icon="fas fa-book"
                    />
                    <NItem
                      to="/hotel?tab=customer"
                      active={tab === 'customer'}
                      label="Customer"
                      icon="fas fa-download"
                    />
                    <NItem to="/hotel?tab=room" active={tab === 'room'} label="Room" icon="fas fa-download" />
                    <NItem
                      to="/hotel?tab=roomcategory"
                      active={tab === 'roomcategory'}
                      label="Room Category"
                      icon="fas fa-download"
                    />
                    <NItem
                      to="/hotel?tab=inventory"
                      active={tab === 'inventory'}
                      label="Inventory"
                      icon="fas fa-inventory"
                    />
                  </Nav>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs="12" sm="12" md="8" lg="9" className="mt-3">
              <Card>
                <Card.Body>
                  {tab === 'inventory' ? (
                    <Inventory />
                  ) : tab === 'customer' ? (
                    <Customer />
                  ) : tab === 'room' ? (
                    <Room />
                  ) : tab === 'roomcategory' ? (
                    <RoomCategory />
                  ) : (
                    <Reciept />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Main>
    </>
  )
}
export default Hotel
