/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { ALL_USER, CREATE_USER, USER_PLAN } from '../../../scripts/config/RestEndpoints'
import PaginatedTable from '../../paginating/PaginatedTable'
import ModalBox from '../../general/Modal'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import UserForm from './user_tab_components/UserForm'
import { FaTrash } from 'react-icons/fa'

function UserTab() {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const reffer = () => useRef(null)
  const urlRef = useRef(ALL_USER)
  const fieldRef = useRef({
    _id: { name: 'UID', type: Number },
    firstname: { name: 'Firstname', type: String },
    lastname: { name: 'Lastname', type: String },
    email: { name: 'Email', type: Number },
    role: {
      name: 'Role',
      type: String,
      transform: {
        out: (rowData) => {
          return (
            <>
              <div className="text-bold">{rowData?.role?.name}</div>
              <div className="text-mute">{rowData?.role?._id}</div>
            </>
          )
        },
      },
    },
    phone: { name: 'Phone', type: String },
    password: { name: 'Password', type: Number },
    status: { name: 'Status', type: String },
    'createdAt.date': { name: 'Created', type: Date },
    'updatedAt.date': { name: 'Updated', type: Date, hideFromSearch: true },
    action: {
      name: createUserButton,
      type: String,
      virtual: true,
      transform: { out },
    },
  })

  async function deleteUser(userId) {
    const fetchData = {
      url: CREATE_USER + '/' + userId,
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
          title="Delete this user"
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
          title="Edit this user"
          variant="warning"
        >
          <i className="fas fa-edit"></i>
        </Button>
      </ButtonGroup>
    )
  }

  function createUserButton() {
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
        onAccept={() => deleteUser(itemId)}
        header={<h1 className="text-center">Confirm Deletion</h1>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this user</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
        }}
        control={false}
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'} User`}</h2>}
        backdrop
      >
        <UserForm setReload={(e) => setReload(!reload)} data={updatingData} />
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="users"
        fields={fieldRef.current}
        primaryKey="firstname"
        /* setData={data => setData(data)} */ forCurrentUser={false}
        reload={reload}
      />
    </>
  )
}

export default UserTab
