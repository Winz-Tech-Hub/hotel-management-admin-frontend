/* eslint-disable eqeqeq */
import React, { useRef, useState } from 'react'
import { ALL_ITEMDISPENSE, ITEMDISPENSE } from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'
import { FaTrash } from 'react-icons/fa'
import ModalBox from '../../general/Modal'
import { Button, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import ItemDispenseForm from './itemDispense/ItemDispenseForm'

function ItemDispense() {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemDispenseId, setItemDispenseId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_ITEMDISPENSE)

  const fieldsRef = useRef({
    _id: { name: 'ID', type: String },
    fromStaff: {
      name: 'From Staff',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.fromStaff?._id}</div>
            <div className="fw-bold">{row?.fromStaff?.firstname}</div>
          </>
        ),
      },
    },
    toStaff: {
      name: 'To Staff',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.toStaff?._id}</div>
            <div className="fw-bold">{row?.toStaff?.firstname}</div>
          </>
        ),
      },
    },
    item: {
      name: 'Item',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.item?._id}</div>
            <div className="fw-bold">{row?.item?.name}</div>
          </>
        ),
      },
    },
    quantity: { name: 'Quantity', type: Number },
    amount: { name: 'Amount', type: Number },
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
          title="Create new itemDispense"
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

  const queryRef = useRef({ populate: ['fromStaff', 'toStaff', 'item'] })

  async function deleteItemDispense(itemDispenseId) {
    const fetchData = {
      url: ITEMDISPENSE + itemDispenseId,
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
            setItemDispenseId(rowData._id)
          }}
          style={{ padding: '5px' }}
          title="Delete this itemDispense"
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
          title="Edit this itemDispense"
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
        onAccept={() => deleteItemDispense(itemDispenseId)}
        header={<h2 className="text-center">Confirm Deletion</h2>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this itemDispense</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
        }}
        control={false}
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'}`} ItemDispense</h2>}
        backdrop
      >
        {!updatingData ? (
          <ItemDispenseForm />
        ) : (
          <ItemDispenseForm setReload={() => setReload(!reload)} data={updatingData} />
        )}
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="itemDispenses"
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

export default ItemDispense
