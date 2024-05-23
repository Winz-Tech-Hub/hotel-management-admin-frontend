import React, { useRef, useState } from 'react'
import { ALL_RECEIPT, RECEIPT } from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'
import { FaTrash } from 'react-icons/fa'
import ModalBox from '../../general/Modal'
import { Button, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import ReceiptForm from './receipt/ReceiptForm'
import ReceiptSlip from './receipt/ReceiptSlip'

function Receipt() {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)
  const [activeReceipt, setActiveReceipt] = useState([])
  const [showReceipt, setShowReceipt] = useState(false)

  const urlRef = useRef(ALL_RECEIPT)

  const fieldsRef = useRef({
    _id: { name: 'ID', type: String },
    customer: {
      name: 'Customer',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.customer?._id}</div>
            <div className="fw-bold">{row?.customer?.name}</div>
          </>
        ),
      },
    },
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
    roomCategory: {
      name: 'Room Cat.',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.roomCategory?._id}</div>
            <div className="fw-bold">{row?.roomCategory?.name}</div>
          </>
        ),
      },
    },
    room: {
      name: 'Room',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.room?._id}</div>
            <div className="fw-bold">{row?.room?.name}</div>
          </>
        ),
      },
    },
    amount: { name: 'Amount (NGN)', type: Number },
    discount: { name: 'Bonus (NGN)', type: Number },
    duration: { name: 'Duration', type: Number },
    paymentMethod: { name: 'Payment Method', type: Number },
    checkedOut: { name: 'Checked Out', type: Boolean },
    status: { name: 'Status', type: String },
    'checkInDate.dateString': { name: 'Check in', type: Date },
    'checkOutDate.dateString': { name: 'Check out', type: Date },
    'createdAt.date': { name: 'Created', type: Date },
    'updatedAt.date': { name: 'Updated', type: Date, hideFromSearch: true },
    action: {
      name: () => (
        <Button
          onClick={() => {
            setShowCreateForm(true)
          }}
          style={{ padding: '5px' }}
          title="Create Receipt"
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

  const queryRef = useRef({
    populate: ['customer', 'staff', 'roomCategory', 'room'],
  })

  async function deleteReceipt(receiptId) {
    const fetchData = {
      url: RECEIPT + receiptId,
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
          title="Delete this receipt"
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
          title="Edit this receipt"
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
        show={showReceipt}
        onCancel={() => setShowReceipt(false)}
        onAccept={() => setShowReceipt(false)}
        header={<h2 className="text-center">Receipt</h2>}
        type="success"
        backdrop
      >
        <ReceiptSlip receiptData={activeReceipt} />
      </ModalBox>

      <ModalBox
        show={showConfirmDeletion}
        onCancel={() => setShowConfirmDeletion(false)}
        onAccept={() => deleteReceipt(itemId)}
        header={<h2 className="text-center">Confirm Deletion</h2>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this receipt</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
        }}
        control={false}
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'}`} Receipt</h2>}
        backdrop
      >
        {!updatingData ? <ReceiptForm /> : <ReceiptForm setReload={() => setReload(!reload)} data={updatingData} />}
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="receipts"
        fields={fieldsRef.current}
        query={queryRef.current}
        primaryKey="createdAt.date"
        sortOrder={DESCENDING}
        forCurrentUser={false}
        reload={reload}
        rowOptions={(rowData) => ({
          onClick: () => {
            setActiveReceipt(rowData)
            setShowReceipt(true)
          },
          style: {
            cursor: 'pointer',
          },
        })}
      />
    </>
  )
}

export default Receipt
