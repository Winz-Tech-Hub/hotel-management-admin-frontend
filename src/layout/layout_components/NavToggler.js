import React, { Component } from 'react'
import { Helpers } from '../../assets/vendor/js/helpers'
import { $ } from '../../assets/vendor/libs/jquery/jquery'

class NavToggler extends Component {
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
    let isMobile = Helpers.isMobileScreen()
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
    return !this.state.smallScreen ? (
      <div
        onClick={this.toggle}
        className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none"
        style={{ cursor: 'pointer' }}
      >
        {this.props.children}
      </div>
    ) : null
  }
}

export default NavToggler
