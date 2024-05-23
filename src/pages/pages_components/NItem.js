import React from 'react'
import { NavItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function NItem({ active, to, label, icon }) {
  return (
    <>
      <NavItem>
        <Link to={to} className={`nav-link ${active ? 'active' : ''}`}>
          <i className={`${icon} me-1"`}></i> {label}
        </Link>
      </NavItem>
    </>
  )
}

export default NItem
