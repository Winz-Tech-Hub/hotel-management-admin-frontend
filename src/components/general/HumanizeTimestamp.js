/* eslint-disable react/prop-types */
import React, { useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'

const HumanizeTimestamp = ({ timestamp }) => {
  const timeString = useMemo(() => {
    let t = timestamp
    if (!(t instanceof Date)) {
      t = new Date(t)
    }
    const timeStringTemp = formatDistanceToNow(t, {
      addSuffix: true,
    })
    return timeStringTemp
  }, [timestamp])

  return <span className="text-center">{timeString}</span>
}

export default HumanizeTimestamp
