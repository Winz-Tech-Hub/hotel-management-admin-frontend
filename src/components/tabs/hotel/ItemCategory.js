/* eslint-disable eqeqeq */
import React, { useRef, useState } from 'react'
import { ALL_ITEMCATEGORY, CREATE_ITEMCATEGORY, ITEMCATEGORY } from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { ASCENDING } from '../../paginating/PaginatedTable'
import ModalBox from '../../general/Modal'
import { Button, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import ItemCategoryForm from './itemcategory/ItemCategoryForm'
import { FaTrash } from 'react-icons/fa'
import { ACTIVE, INACTIVE } from '../../../scripts/config/contants'

function ItemCategory() {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_ITEMCATEGORY)

  const fieldsRef = useRef({
    _id: { name: 'ID', type: String },
    name: { name: 'Name', type: String },
    department: { name: 'Department', type: String },
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
          title="Add Item"
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

        <Button
          onClick={() => {
            action('cancel', rowData._id)
          }}
          style={{ padding: '5px' }}
          title="Cancel"
          variant="danger"
        >
          <i className="fas fa-times"></i>
        </Button>
        <Button
          onClick={() => {
            action('approve', rowData._id)
          }}
          style={{ padding: '5px' }}
          title="Approve"
          variant="success"
        >
          <i className="fas fa-mark"></i>
        </Button>
      </ButtonGroup>
    )
  }

  const queryRef = useRef({})

  async function deleteItemCategory(categoryId) {
    const fetchData = {
      url: ITEMCATEGORY + categoryId,
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
  async function action(act, id) {
    const fetchData = {
      url: CREATE_ITEMCATEGORY,
      method: 'PATCH',
      data: {
        id,
        status: act !== 'approve' ? INACTIVE : ACTIVE,
      },
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
      setReload(!reload)
      toast.success(data?.data?.message || 'Success')
    }
  }

  return (
    <>
      <ModalBox
        show={showConfirmDeletion}
        onCancel={() => setShowConfirmDeletion(false)}
        onAccept={() => deleteItemCategory(itemId)}
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
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'}`} Item Category</h2>}
        backdrop
      >
        {!updatingData ? (
          <ItemCategoryForm />
        ) : (
          <ItemCategoryForm setReload={() => setReload(!reload)} data={updatingData} />
        )}
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="itemCategories"
        fields={fieldsRef.current}
        query={queryRef.current}
        primaryKey="department"
        sortOrder={ASCENDING}
        forCurrentUser={false}
        reload={reload}
      />
    </>
  )
}

export default ItemCategory
