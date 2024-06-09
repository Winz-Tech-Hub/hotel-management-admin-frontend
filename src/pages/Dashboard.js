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
        <Row className="s-grid"></Row>
      </Main>
    </>
  )
}
export default Dashboard
