import React from 'react'
import Main from '../layout/Main'
import { Row, Col } from 'react-bootstrap'
import InfoCard from '../components/tabs/home/home_components/InfoCard'
import { ACTIVE, BOOKED } from '../scripts/config/contants'
import ConnectedClients from '../components/tabs/home/home_components/ConnectedClients'
import { mongooseModelQueryObjectForDateRange } from '../scripts/misc'

function Dashboard() {
  return (
    <>
      <Main>
        <Row className="s-grid">
          <Col xs="12" sm="6" md="4" lg="3">
            <InfoCard name="Total Restaurant Sale" datastore={'RestaurantSale'} query={{ status: ACTIVE }} />
          </Col>
          <Col xs="12" sm="6" md="4" lg="3">
            <InfoCard name="Currently Booked Rooms" datastore={'Room'} query={{ status: BOOKED }} />
          </Col>
          <Col xs="12" sm="6" md="4" lg="3">
            <InfoCard name="Total booking" datastore={'Receipt'} query={{ status: ACTIVE }} />
          </Col>
          <Col xs="12" sm="6" md="4" lg="3">
            <InfoCard name="Total customer registered" datastore={'Customer'} query={{ status: ACTIVE }} />
          </Col>
          <Col xs="12" sm="6" md="4" lg="3">
            <InfoCard
              name="Total customer's commission"
              datastore={'Customer'}
              field={'commission'}
              type="money"
              query={{ status: ACTIVE }}
            />
          </Col>

          <Row>
            <Col xs="12" sm="6" md="4" lg="3">
              <InfoCard
                name="Today's Restaurant Sale"
                datastore={'RestaurantSale'}
                query={{ status: ACTIVE, ...mongooseModelQueryObjectForDateRange() }}
              />
            </Col>
            <Col xs="12" sm="6" md="4" lg="3">
              <InfoCard
                name="Last Week Restaurant Sale Amount"
                datastore={'RestaurantSale'}
                query={{ status: ACTIVE, ...mongooseModelQueryObjectForDateRange('lastweek') }}
              />
            </Col>
            <Col xs="12" sm="6" md="4" lg="3">
              <InfoCard
                name="Last Month Restaurant Sale Amount"
                datastore={'RestaurantSale'}
                query={{ status: ACTIVE, ...mongooseModelQueryObjectForDateRange('lastmonth') }}
              />
            </Col>
          </Row>

          <Row>
            <Col xs="12" sm="6" md="4" lg="3">
              <InfoCard
                name="Today's Restaurant Sale Amount"
                datastore={'RestaurantSale'}
                field={'amount'}
                type="money"
                query={{ status: ACTIVE, ...mongooseModelQueryObjectForDateRange() }}
              />
            </Col>
            <Col xs="12" sm="6" md="4" lg="3">
              <InfoCard
                name="Last Week Restaurant Sale Amount"
                datastore={'RestaurantSale'}
                field={'amount'}
                type="money"
                query={{ status: ACTIVE, ...mongooseModelQueryObjectForDateRange('lastweek') }}
              />
            </Col>
            <Col xs="12" sm="6" md="4" lg="3">
              <InfoCard
                name="Last Month Restaurant Sale Amount"
                datastore={'RestaurantSale'}
                field={'amount'}
                type="money"
                query={{ status: ACTIVE, ...mongooseModelQueryObjectForDateRange('lastmonth') }}
              />
            </Col>
          </Row>

          <Row>
            <Col xs="12" sm="6" md="4" lg="3">
              <InfoCard
                name="Today's Booking"
                datastore={'Receipt'}
                query={{ status: ACTIVE, ...mongooseModelQueryObjectForDateRange() }}
              />
            </Col>
            <Col xs="12" sm="6" md="4" lg="3">
              <InfoCard
                name="Last Week Booking"
                datastore={'Receipt'}
                query={{ status: ACTIVE, ...mongooseModelQueryObjectForDateRange('lastweek') }}
              />
            </Col>
            <Col xs="12" sm="6" md="4" lg="3">
              <InfoCard
                name="Last Month Booking"
                datastore={'Receipt'}
                query={{ status: ACTIVE, ...mongooseModelQueryObjectForDateRange('lastmonth') }}
              />
            </Col>
          </Row>

          <Row>
            <Col xs="12" sm="6" md="4" lg="3">
              <InfoCard
                name="Today's Booking Amount"
                datastore={'Receipt'}
                field={'actualAmount'}
                type="money"
                query={{ status: ACTIVE, ...mongooseModelQueryObjectForDateRange() }}
              />
            </Col>
            <Col xs="12" sm="6" md="4" lg="3">
              <InfoCard
                name="Last Week Booking Amount"
                datastore={'Receipt'}
                field={'actualAmount'}
                type="money"
                query={{ status: ACTIVE, ...mongooseModelQueryObjectForDateRange('lastweek') }}
              />
            </Col>
            <Col xs="12" sm="6" md="4" lg="3">
              <InfoCard
                name="Last Month Booking Amount"
                datastore={'Receipt'}
                field={'actualAmount'}
                type="money"
                query={{ status: ACTIVE, ...mongooseModelQueryObjectForDateRange('lastmonth') }}
              />
            </Col>
          </Row>
        </Row>
      </Main>
    </>
  )
}
export default Dashboard
