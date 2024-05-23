/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import { Badge, Card, Col, Row } from 'react-bootstrap'
import React from 'react'

function Gain({ noTrade, amount, percentage, day, style, className }) {
  return (
    <Card className={`${className ? className : ''} `} style={{ ...style }}>
      <Card.Body className="py-2">
        <Row className="gain-header">
          <Col className="col-7 m-0 p-0">
            <span className="text-capitalize overflow">{day}</span>
          </Col>
          <Col className="col-5 m-0 p-0">
            <div className="pull-right m-1 p-0">
              <span className="gain-trade-label pull-right">&nbsp;Trade{noTrade > 1 ? 's' : ''}</span>
              <Badge className="pull-right" bg={noTrade > 50 ? 'success' : 'info'} pill={true}>
                {noTrade}
              </Badge>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="m-0 p-0">
            <h4 className="text-bold text-nowrap my-2">+{amount}%</h4>
            <small className={`text-${percentage < 1 ? 'danger' : 'success'} gain-profit`}>
              <i className={`bx bx-${percentage < 1 ? 'down' : 'up'}-arrow-alt`}></i>${percentage} Profit
            </small>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default Gain
