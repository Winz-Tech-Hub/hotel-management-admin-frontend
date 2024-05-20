import React from 'react'
import { ThemeConsumer } from '../../components/context/theme'
import { Link } from 'react-router-dom'

function ThemeToggler({ toggleTheme }) {
  let scrollUp = () => (document.documentElement.scrollTop = 0)
  return (
    <ThemeConsumer>
      {(style) => (
        <div className="list-group" style={{ position: 'fixed', right: '20px', bottom: '65px' }}>
          <Link title="Home" to={'/home'} className="list-item" style={{ color: style.color, cursor: 'pointer' }}>
            <i className="font-lg bx bx-home bx-sm align-middle" />
          </Link>
          <a
            title="Reload Page"
            href={window.location.search}
            className="list-item"
            style={{ color: style.color, cursor: 'pointer' }}
          >
            <i className="font-lg bx bx-refresh bx-sm align-middle" />
          </a>
          <Link title="Refresh" to={'/refresh'} className="list-item" style={{ color: style.color, cursor: 'pointer' }}>
            <i className="font-lg bx bx-rotate-right bx-sm align-middle" />
          </Link>
          <span
            title="Scroll to top"
            className="list-item"
            style={{ color: style.color, cursor: 'pointer' }}
            onClick={() => scrollUp()}
          >
            <i className="font-lg bx bx-chevron-up-circle bx-sm align-middle" />
          </span>
          <span
            className="list-item py-1"
            style={{ color: style.color, cursor: 'pointer' }}
            onClick={() => toggleTheme()}
          >
            <i className="bx bx-moon bx-sm align-middle" />
          </span>
        </div>
      )}
    </ThemeConsumer>
  )
}

export default ThemeToggler
