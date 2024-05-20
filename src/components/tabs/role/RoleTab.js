/* eslint-disable eqeqeq */
import React, { useRef, useState } from 'react'
import { ALL_ROLE, ROLE } from '../../../scripts/config/RestEndpoints'
import { Button, ButtonGroup } from 'react-bootstrap'
import fetcher from '../../../scripts/SharedFetcher'
import { toast } from 'react-toastify'
import { FaTrash } from 'react-icons/fa'
import ModalBox from '../../general/Modal'
import RoleForm from './role/RoleForm'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'

function RoleTab() {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_ROLE)

  const fieldsRef = useRef({
    _id: { name: 'ID', type: String },
    name: { name: 'Name', type: String },
    position: { name: 'Position', type: Number },
    status: { name: 'Status', type: String },
    'createdAt.date': { name: 'Created', type: Date },
    'updatedAt.date': { name: 'Updated', type: Date, hideFromSearch: true },
    action: {
      name: () => (
        <Button
          onClick={() => {
            setShowCreateForm(true)
          }}
          style={{ padding: '5px' }}
          title="Create new role"
          variant="warning"
        >
          <i className="fas fa-user"></i> Create
        </Button>
      ),
      type: String,
      virtual: true,
      transform: { out },
    },
  })

  const queryRef = useRef({})

  async function deleteRole(roleId) {
    const fetchData = {
      url: ROLE + roleId,
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

  function out(rowData) {
    return (
      <ButtonGroup size="sm">
        <Button
          onClick={() => {
            setShowConfirmDeletion(true)
            setItemId(rowData._id)
          }}
          style={{ padding: '5px' }}
          title="Delete this role"
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
          title="Edit this role"
          variant="warning"
        >
          <i className="fas fa-edit"></i>
        </Button>
      </ButtonGroup>
    )
  }
  return (
    <>
      <ModalBox
        show={showConfirmDeletion}
        onCancel={() => setShowConfirmDeletion(false)}
        onAccept={() => deleteRole(itemId)}
        header={<h2 className="text-center">Confirm Deletion</h2>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this role</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
        }}
        control={false}
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'}`} Role</h2>}
        backdrop
      >
        {!updatingData ? <RoleForm /> : <RoleForm setReload={() => setReload(!reload)} data={updatingData} />}
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="roles"
        fields={fieldsRef.current}
        query={queryRef.current}
        primaryKey="createdAt.date"
        sortOrder={DESCENDING}
        forCurrentUser={false}
        reload={reload}
      />
    </>
  )
}

export default RoleTab
