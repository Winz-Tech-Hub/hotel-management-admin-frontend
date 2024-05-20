import React from 'react'
import Main from '../layout/Main'
import { Row, Col } from 'react-bootstrap'
import InfoCard from '../components/tabs/home/home_components/InfoCard'
import { ACTIVE } from '../scripts/config/contants'
import ConnectedClients from '../components/tabs/home/home_components/ConnectedClients'

function Dashboard() {
  return (
    <>
      <Main>
        <Row className="s-grid">
          <Col xs="12" sm="6" md="4" lg="3">
            <InfoCard name="Users" datastore={'User'} />
          </Col>

          <Col xs="12" sm="6" md="4" lg="3">
            <InfoCard
              name="System Revenue"
              datastore={'SystemRevenue'}
              field={'amount'}
              type="money"
              query={{ $nin: [{ type: ['withdraw'] }] }}
            />
          </Col>

          <Col xs="12" sm="6" md="4" lg="3">
            <InfoCard
              name="AutoTrade Revenue"
              datastore={'AutoTradePlanTransaction'}
              field={'amount'}
              type="money"
              query={{ status: ACTIVE }}
            />
          </Col>

          <Col xs="12" sm="6" md="4" lg="3">
            <ConnectedClients />
          </Col>
        </Row>
      </Main>
    </>
  )
}
export default Dashboard
