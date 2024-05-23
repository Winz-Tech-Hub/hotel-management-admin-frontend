/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React from 'react'

const TRow = React.forwardRef(function TRow(
  { result, resultIndex, style, className, options, numbered = true, fieldKeys, fields, computeValue, ...props },
  ref,
) {
  return (
    <tr
      {...props}
      style={style?.trStyle}
      className={`${className?.trClass || ''}`}
      {...options}
      onClick={options?.onClick ? () => options?.onClick(result) : () => {}}
      ref={ref}
    >
      {numbered ? (
        <td style={style?.tdStyle || {}} className={`${className?.tdClass || ''}`}>
          {resultIndex + 1}
        </td>
      ) : null}
      {fieldKeys.map((field) => (
        // Cell
        <td
          key={field}
          style={style?.tdStyle}
          className={`${className?.tdClass || ''} ${!fields[field]?.virtual ? 'overflow-mw200' : ''}`}
        >
          {computeValue(result[field], field, resultIndex)}
        </td>
      ))}
    </tr>
  )
})

TRow.displayName = 'TRow'

export default TRow
