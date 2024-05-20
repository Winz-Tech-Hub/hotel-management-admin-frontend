import { Link } from 'react-router-dom'
import imgLight from '../assets/img/illustrations/page-misc-error-light.png'
import imgDark from '../assets/img/illustrations/page-misc-error-light.png'
import React from 'react'
import { Container } from 'react-bootstrap'

export default function NotFound(props) {
  return (
    <>
      <Container fluid>
        <div className="misc-wrapper">
          <h2 className="mb-2 mx-2">Page Not Found :(</h2>
          <p className="mb-4 mx-2">Oops! 😖 The requested URL was not found on this server.</p>
          <Link to="/" className="btn btn-primary">
            Back to home
          </Link>
          <div className="mt-3">
            <img
              src={imgLight}
              alt="Error"
              width="500"
              className="img-fluid"
              data-app-dark-img={imgLight}
              data-app-light-img={imgDark}
            />
          </div>
        </div>
      </Container>
    </>
  )
}
