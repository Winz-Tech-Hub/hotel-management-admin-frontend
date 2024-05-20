import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import React from 'react'

const Utility = ({ comingSoon, ...props }) => {
  return (
    <Link to={props.link ? props.link : '/'} style={props.style ? { ...props.style } : { color: 'blue' }}>
      <Card className="utilityLink" style={{ padding: '5px', paddingTop: '20px' }}>
        {!comingSoon ? null : (
          <div className="badge bg-warning fw-bold" style={{ position: 'absolute', top: 0, right: 0, fontSize: '8px' }}>
            Coming Soon
          </div>
        )}
        <Card.Body style={{ padding: 0 }}>
          <div className="text-center align-items-center justify-content-between">
            {props.img ? (
              <img src={props.img} alt={props.alt ? props.alt : 'Icon'} className="rounded-3" />
            ) : (
              <i className={props.icon} style={{ fontSize: '200%' }}></i>
            )}
          </div>
          <p className="text-center mb-1 text-black">
            <small>{props.title}</small>
          </p>
        </Card.Body>
      </Card>
    </Link>
  )
}

export default Utility
