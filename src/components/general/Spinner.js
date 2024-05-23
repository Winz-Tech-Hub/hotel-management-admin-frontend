/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React from 'react'
import { InputGroup } from 'react-bootstrap'

function Spinner(props) {
  if (props.loadingError) {
    return props.table ? (
      <tr>
        <td colSpan={props.table.colspan || 1}>
          <InputGroup.Text className="fw-bold">
            <span>{props.loadingErrorMessage || "Couldn't load data"} </span>
          </InputGroup.Text>
        </td>
      </tr>
    ) : (
      <InputGroup.Text className="fw-bold">
        <span>{props.loadingErrorMessage || "Couldn't load data"} </span>
      </InputGroup.Text>
    )
  }

  if (props.loading) {
    return props.table ? (
      <tr>
        <td colSpan={props.table.colspan || 1}>
          <InputGroup.Text className="fw-bold">
            <span>{props.loadingText} &nbsp;</span>
            <div className={`spinner-${props.type ? props.type : 'border'} text-primary`} role="status"></div>
          </InputGroup.Text>
        </td>
      </tr>
    ) : (
      <InputGroup.Text className="fw-bold">
        <span>{props.loadingText} &nbsp;</span>
        <div className={`spinner-${props.type ? props.type : 'border'} text-primary`} role="status"></div>
      </InputGroup.Text>
    )
  }

  return props.text || props.children
}

export default Spinner
