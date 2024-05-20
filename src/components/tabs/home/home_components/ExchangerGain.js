/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import { Card, Col } from 'react-bootstrap'
import React from 'react'

function ExchangerGain({ style, className, heading, name, day, percentage, noTrade, amount }) {
  return (
    <Card className={`${className ? className : ''} `} style={{ ...style }}>
      <Col className="col-12" style={{ borderRadius: '0 100px 0 0' }}>
        <Card.Body className="bold text-black m0p10">
          <div>
            <span className="h3">
              {heading} <span className="fa pull-right text-info">{amount >= 0 ? '$' + amount : null}</span>
            </span>
          </div>
        </Card.Body>
      </Col>
      <Card.Body>
        <Col className="col-12">
          <div className="d-flex flex-row align-items-start justify-content-between">
            <Card.Title className="gain-header">
              <h3 className="text-nowrap mb-2 fw-bold text-primary">{name}</h3>
              <span>{day}</span>
            </Card.Title>
            <div className="mt-sm-auto">
              <small className="text-primary text-nowrap fw-semibold">
                <span className="badge bg-label-info">{noTrade}</span> Trades
              </small>
              <h3 className="text-success mb-0">+{percentage}%</h3>
            </div>
          </div>
        </Col>
      </Card.Body>
    </Card>
  )
}

export default ExchangerGain
