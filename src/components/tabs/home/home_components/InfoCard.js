import { Card } from 'react-bootstrap'
import React from 'react'
import { useDataCount, useDataFieldSum } from '../../../../scripts/hooks/hookCollection'
import accounting from 'accounting'

const InfoCard = ({ style, className, name = null, field, datastore, title, query, type, typeSymbol }) => {
  const [value] = datastore && field ? useDataFieldSum({ datastore, field, query }) : useDataCount({ datastore, query })

  return (
    <Card className={`${className ? className : ''} `} style={{ ...style }} title={title}>
      <Card.Body className="text-center h1">
        {type === 'money' ? accounting.formatMoney(value, typeSymbol, '2') : `${typeSymbol || ''} ${value}`}
      </Card.Body>
      <div className="text-center text-primary">{name}</div>
    </Card>
  )
}

export default InfoCard
