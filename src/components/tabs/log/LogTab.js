/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { ALL_LOG, LOG } from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'
import ModalBox from '../../general/Modal'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import LogForm from './log_tab_components/LogForm'
import { FaTrash } from 'react-icons/fa'
import LogView from './log_tab_components/LogView'

function LogTab(props) {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [viewRef, setViewRef] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_LOG)
  const fieldRef = useRef({
    _id: { name: 'Id', type: String },
    model: { name: 'Model', type: String },
    dataId: { name: 'Data Id', type: String },
    staff: {
      name: 'Staff',
      type: Number,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.staff?._id}</div>
            <div className="fw-bold">{row?.staff?.firstname + ' ' + row?.staff?.lastname}</div>
          </>
        ),
      },
    },
    description: { name: 'Description', type: String },
    status: { name: 'Status', type: String },
    'createdAt.date': { name: 'Created', type: Date },
    'updatedAt.date': { name: 'Updated', type: Date, hideFromSearch: true },
    action: {
      name: createLogButton,
      type: String,
      virtual: true,
      transform: { out },
    },
  })
  const queryRef = useRef({ populate: ['staff'] })

  async function deleteLog(logId) {
    const fetchData = {
      url: LOG + logId,
      method: 'DELETE',
    }
    let data = null
    try {
      data = await fetcher.fetch(fetchData)
    } catch (er) {
      toast.error(er.message)
    }
    if (!data?.data?.status) {
      toast.error(data.data.message)
    } else {
      setShowConfirmDeletion(false)
      setReload(!reload)
      toast.success(data.data.message)
    }
  }

  function out(rowData, rowIndex) {
    return (
      <ButtonGroup size="sm">
        <Button
          onClick={(e) => {
            setShowConfirmDeletion(true)
            setItemId(rowData._id)
            e.stopPropagation()
          }}
          style={{ padding: '5px' }}
          title="Delete this log"
          variant="danger"
        >
          <FaTrash />
        </Button>
        <Button
          onClick={(e) => {
            setShowCreateForm(true)
            setUpdatingData(rowData)
            e.stopPropagation()
          }}
          style={{ padding: '5px' }}
          title="Edit this log"
          variant="warning"
        >
          <i className="fas fa-edit"></i>
        </Button>
      </ButtonGroup>
    )
  }

  function createLogButton() {
    return (
      <>
        <Button onClick={() => setShowCreateForm(true)} style={{ padding: '5px', fontSize: '11px' }}>
          Add
        </Button>
      </>
    )
  }

  return (
    <>
      <ModalBox
        show={showConfirmDeletion}
        onCancel={() => setShowConfirmDeletion(false)}
        onAccept={() => deleteLog(itemId)}
        header={<h1 className="text-center">Confirm Deletion</h1>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this log</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
        }}
        control={false}
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'} Log`}</h2>}
        backdrop
      >
        <LogForm setReload={(e) => setReload(!reload)} data={updatingData} />
      </ModalBox>

      <ModalBox
        show={viewRef}
        onCancel={() => {
          setViewRef(false)
        }}
        noControl
        noHeader
        backdrop
      >
        <LogView model={updatingData?.model} dataId={updatingData?.dataId} />
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="logs"
        fields={fieldRef.current}
        primaryKey="createdAt.date"
        /* setData={data => setData(data)} */ forCurrentUser={false}
        query={queryRef.current}
        rowOptions={(rowData) => ({
          onClick: (e) => {
            setUpdatingData(rowData)
            setViewRef(true)
            e.stopPropagation()
          },
          style: {
            cursor: 'pointer',
          },
        })}
        sortOrder={DESCENDING}
        reload={reload}
      />
    </>
  )
}

export default LogTab
