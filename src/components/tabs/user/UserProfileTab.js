/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { ALL_USER_PROFILE } from '../../../scripts/config/RestEndpoints'
import PaginatedTable from '../../paginating/PaginatedTable'
import ModalBox from '../../general/Modal'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import UserProfileForm from './user_profile_tab_components/UserProfileForm'
import { FaTrash } from 'react-icons/fa'

function UserProfileTab(props) {
  const [reload, setReload] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_USER_PROFILE)
  const fieldRef = useRef({
    _id: { name: 'Id', type: String },
    uid: { name: 'UID', type: String },
    bio: { name: 'Bio', type: String },
    avatar: { name: 'Avatar', type: Number, hideFromSearch: true },
    country: { name: 'Country', type: Number },
    state: { name: 'State', type: Number },
    'createdAt.date': { name: 'Created', type: Date },
    'updatedAt.date': { name: 'Updated', type: Date, hideFromSearch: true },
    action: {
      name: 'Action',
      type: String,
      virtual: true,
      transform: { out },
    },
  })

  async function deleteUserProfile(userProfileId) {
    const fetchData = {
      url: '/user-profile/' + userProfileId,
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
          style={{ padding: '5px', fontSize: '11px' }}
          title="Delete this user profile"
          variant="danger"
        >
          <FaTrash />
        </Button>
        <Button
          onClick={() => {
            setShowCreateForm(true)
            setUpdatingData(rowData)
          }}
          style={{ padding: '5px', fontSize: '11px' }}
          title="Edit this user profile"
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
        onAccept={() => deleteUserProfile(itemId)}
        header={<h2 className="text-center">Confirm Deletion</h2>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this user profile</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
        }}
        control={false}
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'}`} User Profile</h2>}
        backdrop
      >
        <UserProfileForm setReload={(e) => setReload(!reload)} data={updatingData} />
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="userProfiles"
        fields={fieldRef.current}
        primaryKey="uid"
        /* setData={data => setData(data)} */ forCurrentUser={false}
        reload={reload}
      />
    </>
  )
}

export default UserProfileTab
