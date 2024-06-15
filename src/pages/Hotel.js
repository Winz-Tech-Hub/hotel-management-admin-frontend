import React from 'react'
import Main from '../layout/Main'
import { Card, Col, Container, Nav, Row } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import NItem from './pages_components/NItem'
import Receipt from '../components/tabs/hotel/Receipt'
import Customer from '../components/tabs/hotel/Customer'
import Room from '../components/tabs/hotel/Room'
import RoomCategory from '../components/tabs/hotel/RoomCategory'
import Inventory from '../components/tabs/hotel/Inventory'
import ReferralCommission from '../components/tabs/hotel/ReferralCommission'
import Item from '../components/tabs/hotel/Item'
import ItemCategory from '../components/tabs/hotel/ItemCategory'
import ItemDispense from '../components/tabs/hotel/ItemDispense'

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
                      to="../hotel?tab=receipt"
                      active={!tab || tab === 'receipt'}
                      label="Receipt"
                      icon="fas fa-receipt"
                    />
                    <NItem to="/hotel?tab=customer" active={tab === 'customer'} label="Customer" icon="fas fa-user" />
                    <NItem to="/hotel?tab=room" active={tab === 'room'} label="Room" icon="fas fa-door-open" />
                    <NItem
                      to="/hotel?tab=roomcategory"
                      active={tab === 'roomcategory'}
                      label="Room Category"
                      icon="fas fa-layer-group"
                    />
                    <NItem
                      to="/hotel?tab=inventory"
                      active={tab === 'inventory'}
                      label="Inventory"
                      icon="fas fa-archive"
                    />
                    <NItem to="/hotel?tab=item" active={tab === 'item'} label="Item" icon="fas fa-door-open" />
                    <NItem
                      to="/hotel?tab=itemcategory"
                      active={tab === 'itemcategory'}
                      label="Item Category"
                      icon="fas fa-layer-group"
                    />
                    <NItem
                      to="/hotel?tab=itemdispense"
                      active={tab === 'itemdispense'}
                      label="Item Dispense"
                      icon="fas fa-archive"
                    />
                    <NItem
                      to="/hotel?tab=referral-commission"
                      active={tab === 'referral-commission'}
                      label="Referral Commission"
                      icon="fas fa-archive"
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
                  ) : tab === 'item' ? (
                    <Item />
                  ) : tab === 'itemcategory' ? (
                    <ItemCategory />
                  ) : tab === 'itemdispense' ? (
                    <ItemDispense />
                  ) : tab === 'referral-commission' ? (
                    <ReferralCommission />
                  ) : (
                    <Receipt />
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
