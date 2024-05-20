/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
import { Link } from 'react-router-dom'
import imgLight from '../assets/img/illustrations/page-misc-error-light.png'
import React, { Component } from 'react'
import { Container } from 'react-bootstrap'
import fetcher from '../scripts/SharedFetcher'
import { PUBLIC_OPTIONS } from '../scripts/config/RestEndpoints'
import SharedConfig from '../scripts/SharedConfig'
import { SITE_TITLE } from '../scripts/config/contants'

export default class Error extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: 'An error just occured' }
  }

  componentDidMount() {
    fetcher.fetch(PUBLIC_OPTIONS).then((res) => {
      if (res?.data?.options) {
        for (const option of res?.data?.options) {
          SharedConfig.setSessionData(option.name, option.value)
        }
        document.title =
          (SharedConfig.getSessionData('SITE_TITLE') || SITE_TITLE) +
          (SharedConfig.getSessionData('SITE_TAGLINE') ? ` - ${SharedConfig.getSessionData('SITE_TAGLINE')}` : '')

        if (SharedConfig.getSessionData('SITE_DESCRIPTION')) {
          const metaDescription = document.createElement('meta')
          metaDescription.name = 'description'
          metaDescription.content = SharedConfig.getSessionData('SITE_DESCRIPTION')

          const charsetMeta = document.querySelector('meta[charset="utf-8"]')
          if (charsetMeta) {
            charsetMeta.insertAdjacentElement('afterend', metaDescription)
          }
        }
      }
    })
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true }
  }

  componentDidCatch(error, _errorInfo) {
    this.setState({ hasError: true, error: error.message })
  }

  render() {
    return this.state.hasError ? (
      <>
        <Container fluid>
          <div className="misc-wrapper">
            <h2 className="mb-2 mx-2">An Error has Occured</h2>
            <p className="mb-4 mx-2">{this.state.error}</p>
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
                data-app-light-img={imgLight}
              />
            </div>
          </div>
        </Container>
      </>
    ) : (
      this.props.children
    )
  }
}
