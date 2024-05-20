/* eslint-disable eqeqeq */
import React, { useRef, useState } from 'react'
import { ALL_ROOMCATEGORY, ROOMCATEGORY } from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { ASCENDING } from '../../paginating/PaginatedTable'
import ModalBox from '../../general/Modal'
import { Button, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import RoomCategoryForm from './roomcategory/RoomCategoryForm'
import { FaTrash } from 'react-icons/fa'

function RoomCategory() {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_ROOMCATEGORY)

  const fieldsRef = useRef({
    _id: { name: 'ID', type: String },
    name: { name: 'Name', type: String },
    price: { name: 'Price', type: Number },
    description: { name: 'Description', type: String },
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
          title="Add Room"
          variant="warning"
        >
          <i className="fas fa-plus"></i> Add
        </Button>
      ),
      type: String,
      virtual: true,
      transform: { out },
    },
  })

  function out(rowData) {
    return (
      <ButtonGroup size="sm">
        <Button
          onClick={() => {
            setShowConfirmDeletion(true)
            setItemId(rowData._id)
          }}
          style={{ padding: '5px' }}
          title="Delete this category"
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
          title="Edit this category"
          variant="warning"
        >
          <i className="fas fa-edit"></i>
        </Button>
      </ButtonGroup>
    )
  }

  const queryRef = useRef({})

  async function deleteRoomCategory(categoryId) {
    const fetchData = {
      url: ROOMCATEGORY + categoryId,
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

  return (
    <>
      <ModalBox
        show={showConfirmDeletion}
        onCancel={() => setShowConfirmDeletion(false)}
        onAccept={() => deleteRoomCategory(itemId)}
        header={<h2 className="text-center">Confirm Deletion</h2>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this category</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
        }}
        control={false}
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'}`} Room Category</h2>}
        backdrop
      >
        {!updatingData ? (
          <RoomCategoryForm />
        ) : (
          <RoomCategoryForm setReload={() => setReload(!reload)} data={updatingData} />
        )}
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="roomCategories"
        fields={fieldsRef.current}
        query={queryRef.current}
        primaryKey="price"
        sortOrder={ASCENDING}
        forCurrentUser={false}
        reload={reload}
      />
    </>
  )
}

export default RoomCategory
