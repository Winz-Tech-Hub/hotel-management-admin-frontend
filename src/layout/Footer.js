/* eslint-disable react/prop-types */
import { SITE_TITLE } from '../scripts/config/contants'
import React, { Component } from 'react'
import { Helpers } from '../assets/vendor/js/helpers'
import { $ } from '../assets/vendor/libs/jquery/jquery'
import { ThemeConsumer } from '../components/context/theme'
import Docker from './layout_components/Docker'
import LogOut from '../pages/pages_components/LogOut'
import SharedConfig from '../scripts/SharedConfig'

class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = { smallScreen: false }
    this.toggle.bind(this)
    this.resizeListener.bind(this)
  }

  toggle = (e) => {
    e.preventDefault()
    Helpers.toggleCollapsed()
  }

  resizeListener() {
    const isMobile = Helpers.isMobileScreen()
    this.setState({ smallScreen: isMobile })
    if (isMobile & !Helpers.isCollapsed()) {
      Helpers.toggleCollapsed()
    }
  }

  componentDidMount() {
    this.setState({ smallScreen: Helpers.isMobileScreen() })
    $(window).resize(() => this.resizeListener())
  }

  render() {
    return (
      <ThemeConsumer>
        {(style) => (
          <footer className="footer mt-2" style={style}>
            {this.props.children}
            <div className="d-flex flex-md-row flex-column justify-content-between align-items-md-center">
              {!this.state.smallScreen ? (
                <div style={{ padding: '20px 10px', width: '100%' }}>
                  <div style={{ float: 'left' }}>
                    <a href="/" target="_blank" className="footer-text fw-bolder" rel="noreferrer">
                      &copy; {SharedConfig.getSessionData('SITE_TITLE') || SITE_TITLE}
                    </a>
                  </div>
                  <div style={{ float: 'right' }}>
                    <button className="btn btn-sm btn-outline-danger">
                      <LogOut />
                    </button>
                  </div>
                </div>
              ) : (
                <Docker style={style} />
              )}
            </div>
          </footer>
        )}
      </ThemeConsumer>
    )
  }
}
export default Footer
