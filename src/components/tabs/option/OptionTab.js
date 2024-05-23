/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { ALL_OPTION, OPTION } from '../../../scripts/config/RestEndpoints'
import PaginatedTable from '../../paginating/PaginatedTable'
import ModalBox from '../../general/Modal'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import OptionForm from './option_tab_components/OptionForm'
import { FaTrash } from 'react-icons/fa'

function OptionTab(props) {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_OPTION)
  const fieldRef = useRef({
    _id: { name: 'Id', type: String },
    name: { name: 'Name', type: String },
    value: { name: 'Value', type: String },
    description: { name: 'Description', type: String },
    isPublic: { name: 'Public', type: Boolean },
    'createdAt.date': { name: 'Created', type: Date },
    'updatedAt.date': { name: 'Updated', type: Date, hideFromSearch: true },
    action: {
      name: createOptionButton,
      type: String,
      virtual: true,
      transform: { out },
    },
  })

  async function deleteOption(optionId) {
    const fetchData = {
      url: OPTION + optionId,
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
          onClick={() => {
            setShowConfirmDeletion(true)
            setItemId(rowData._id)
          }}
          style={{ padding: '5px' }}
          title="Delete this option"
          variant="danger"
        >
          <FaTrash />
        </Button>
        <Button
          onClick={() => {
            setShowCreateForm(true)
            setUpdatingData(rowData)
          }}
          style={{ padding: '5px' }}
          title="Edit this option"
          variant="warning"
        >
          <i className="fas fa-edit"></i>
        </Button>
      </ButtonGroup>
    )
  }

  function createOptionButton() {
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
        onAccept={() => deleteOption(itemId)}
        header={<h1 className="text-center">Confirm Deletion</h1>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this option</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
        }}
        control={false}
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'} Option`}</h2>}
        backdrop
      >
        <OptionForm setReload={(e) => setReload(!reload)} data={updatingData} />
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="options"
        fields={fieldRef.current}
        primaryKey="name"
        /* setData={data => setData(data)} */ forCurrentUser={false}
        reload={reload}
      />
    </>
  )
}

export default OptionTab
