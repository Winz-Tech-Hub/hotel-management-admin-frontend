/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import Main from '../layout/Main'
import { Card, Col, Container, Nav, NavItem, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import WithdrawTab from '../components/tabs/transaction/WithdrawTab'
import FundingTab from '../components/tabs/transaction/FundingTab'
import DepositTab from '../components/tabs/transaction/DepositTab'
import ProfitTransactionTab from '../components/tabs/transaction/ProfitTransactionTab'
import SalesTransactionTab from '../components/tabs/transaction/SalesTransactionTab'

function Transaction(__props) {
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
                  <h5>Transactions</h5>
                </Card.Header>
                <Card.Footer className="mt-0 pt-0 mx-1 px-1">
                  <Nav variant="pills" className="s-grid">
                    <NavItem>
                      <Link
                        to="../transaction?tab=deposit"
                        className={`nav-link ${!tab || tab === 'deposit' ? 'active' : ''}`}
                      >
                        <i className="fas fa-download me-1"></i> Deposit
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link
                        to="../transaction?tab=withdraw"
                        className={`nav-link ${tab === 'withdraw' ? 'active' : ''}`}
                      >
                        <i className="fas fa-upload me-1"></i> Withdraw
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link to="../transaction?tab=funding" className={`nav-link ${tab === 'funding' ? 'active' : ''}`}>
                        <i className="fas fa-exchange me-1"></i> Funding
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link
                        to="../transaction?tab=profit_transaction"
                        className={`nav-link ${tab === 'profit_transaction' ? 'active' : ''}`}
                      >
                        <i className="fas fa-history me-1"></i> Profit Transaction
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link
                        to="../transaction?tab=sales_transaction"
                        className={`nav-link ${tab === 'sales_transaction' ? 'active' : ''}`}
                      >
                        <i className="fas fa-history me-1"></i> Sales Transaction
                      </Link>
                    </NavItem>
                  </Nav>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs="12" sm="12" md="8" lg="9" className="mt-3">
              <Card>
                <Card.Body>
                  {tab === 'withdraw' ? (
                    <WithdrawTab />
                  ) : tab === 'funding' ? (
                    <FundingTab />
                  ) : tab === 'profit_transaction' ? (
                    <ProfitTransactionTab />
                  ) : tab === 'sales_transaction' ? (
                    <SalesTransactionTab />
                  ) : (
                    <DepositTab />
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
export default Transaction
