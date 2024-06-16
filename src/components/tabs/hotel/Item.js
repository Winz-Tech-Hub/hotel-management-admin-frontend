/* eslint-disable eqeqeq */
import React, { useRef, useState } from 'react'
import { ALL_ITEM, CREATE_ITEM, ITEM } from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'
import { FaTrash } from 'react-icons/fa'
import ModalBox from '../../general/Modal'
import { Button, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import ItemForm from './item/ItemForm'
import { ACTIVE, INACTIVE } from '../../../scripts/config/contants'

function Item() {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_ITEM)

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
    name: { name: 'Name', type: String },
    quantity: { name: 'Quantity', type: Number },
    price: { name: 'Price', type: Number },
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
          title="Create new item"
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

  const queryRef = useRef({ populate: ['category'] })

  async function deleteItem(itemId) {
    const fetchData = {
      url: ITEM + itemId,
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
      url: CREATE_ITEM,
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

  function out(rowData) {
    return (
      <ButtonGroup size="sm">
        <Button
          onClick={() => {
            setShowConfirmDeletion(true)
            setItemId(rowData._id)
          }}
          style={{ padding: '5px' }}
          title="Delete this item"
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
          title="Edit this item"
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
  return (
    <>
      <ModalBox
        show={showConfirmDeletion}
        onCancel={() => setShowConfirmDeletion(false)}
        onAccept={() => deleteItem(itemId)}
        header={<h2 className="text-center">Confirm Deletion</h2>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this item</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
        }}
        control={false}
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'}`} Item</h2>}
        backdrop
      >
        {!updatingData ? <ItemForm /> : <ItemForm setReload={() => setReload(!reload)} data={updatingData} />}
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="items"
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

export default Item
