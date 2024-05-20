/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react'
import { ALL_SETTING, SETTING } from '../../../scripts/config/RestEndpoints'
import PaginatedTable from '../../paginating/PaginatedTable'
import { FaTrash } from 'react-icons/fa'
import ModalBox from '../../general/Modal'
import SettingForm from './setting_tab_components/SettingForm'
import { Button, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'

function SettingTab(props) {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_SETTING)

  const fieldsRef = useRef({
    _id: { name: 'ID', type: String },
    category: {
      name: 'Category',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.category?._id}</div>
            <div className="fw-bold">{row?.category?.name}</div>
          </>
        ),
      },
    },
    packageId: {
      name: 'Package',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.packageId?._id}</div>
            <div className="fw-bold">{row?.packageId?.name}</div>
          </>
        ),
      },
    },
    name: { name: 'Name', type: String },
    value: { name: 'Value', type: String },
    'createdAt.date': { name: 'Created', type: Date },
    'updatedAt.date': { name: 'Updated', type: Date, hideFromSearch: true },
    action: {
      name: createOptionButton,
      type: String,
      virtual: true,
      transform: { out },
    },
  })

  const queryRef = useRef({
    populate: ['category', 'packageId'],
  })

  async function deleteSetting(settingId) {
    const fetchData = {
      url: SETTING + settingId,
      method: 'DELETE',
    }
    let data = null
    try {
      data = await fetcher.fetch(fetchData)
    } catch (er) {
      toast.error(er.message)
    }
    if (!data?.data?.status) {
      toast.error(data?.data?.message || 'Error')
    } else {
      setShowConfirmDeletion(false)
      setReload(!reload)
      toast.success(data?.data?.message || 'Success')
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
          title="Delete this setting"
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
          title="Edit this setting"
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
        onAccept={() => deleteSetting(itemId)}
        header={<h2 className="text-center">Confirm Deletion</h2>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this setting</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
        }}
        control={false}
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'}`} Setting</h2>}
        backdrop
      >
        <SettingForm setReload={(e) => setReload(!reload)} data={updatingData} />
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="settings"
        fields={fieldsRef.current}
        query={queryRef.current}
        primaryKey="name"
        forCurrentUser={false}
        reload={reload}
      />
    </>
  )
}

export default SettingTab
