/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { DATA_STORE_GET } from '../../../../scripts/config/RestEndpoints'
import Spinner from '../../../paginating/Spinner'
import fetcher from '../../../../scripts/SharedFetcher'
import DataDisplay from '../../../paginating/DataDisplay'

function LogView({ model, dataId }) {
  const [loadingRefData, setLoadingRefData] = useState(false)
  const [refData, setRefData] = useState(null)

  useEffect(() => {
    fetchRefData()
  }, [model, dataId])

  async function fetchRefData() {
    setLoadingRefData(true)
    let data
    try {
      data = await fetcher.fetch(`${DATA_STORE_GET + dataId}/${model}`)
    } catch (er) {
      toast.error(er.message)
    }
    if (data) {
      if (!data.data.status) {
        toast.error(data.data.message)
      } else {
        const d = data.data[model]
        d && setRefData(d)
      }
    }
    setLoadingRefData(false)
  }

  return loadingRefData ? <Spinner /> : refData ? <DataDisplay data={refData} /> : null
}
export default LogView
