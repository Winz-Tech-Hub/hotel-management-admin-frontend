import React from 'react'
import { Card } from 'react-bootstrap'
import { camelCaseToTitleCase } from '../../scripts/misc'

function DataDisplay({ data }) {
  const renderObject = (ls, level = 1) => {
    if (!ls) return null
    return Object.entries(ls).map(([label, value]) => (
      <div key={label} className="py-1 pr-2" style={{ overflowX: 'auto' }}>
        {value instanceof Object ? (
          <>
            <span>{camelCaseToTitleCase(label)}: </span>
            <div style={{ display: 'flex', flex: 'wrap' }}>
              {<span style={{ width: level && 20, border: 0, borderLeft: '1px solid blue' }}></span>}
              <span>{value instanceof Object ? renderObject(value, level + 1) : value}</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flex: 'wrap' }}>
              <span>{camelCaseToTitleCase(label)}: &nbsp;</span>
              <span>{value}</span>
            </div>
          </>
        )}
      </div>
    ))
  }
  return (
    <Card id="print">
      <div className="p-2">{renderObject(data)}</div>
    </Card>
  )
}

export default DataDisplay
