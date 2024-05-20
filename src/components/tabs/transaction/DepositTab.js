/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useRef, useState } from 'react'
import { ALL_TRANSACTION, TRANSACTION, CREATE_TRANSACTION } from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'
import { ACTIVE, INACTIVE, PENDING_APPROVAL } from '../../../scripts/config/contants'
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa'
import ModalBox from '../../general/Modal'
import TransactionForm from './TransactionForm'
import { Button, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'

function DepositTab(props) {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_TRANSACTION)

  const fieldsRef = useRef({
    _id: { name: 'ID', type: String },
    token: {
      name: 'Token',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.token?._id}</div>
            <div className="fw-bold">{row?.token?.symbol}</div>
          </>
        ),
      },
    },
    uid: {
      name: 'User',
      type: Number,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.uid?._id}</div>
            <div className="fw-bold">{row?.uid?.firstname + ' ' + row?.uid?.lastname}</div>
          </>
        ),
      },
    },
    address: { name: 'Wallet Address', type: String },
    preBalance: { name: 'Balance Before', type: Number },
    actualAmount: { name: 'Transaction Token Amount', type: Number },
    resolvedAmount: { name: 'Default Token Amount', type: Number },
    type: { name: 'Type', type: String },
    hash: { name: 'Transaction Hash ID', type: String },
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
          title="Create a deposit transaction for a user"
          variant="warning"
        >
          <i className="fas fa-arrow-down"></i> Create
        </Button>
      ),
      type: String,
      virtual: true,
      transform: { out },
    },
  })

  const queryRef = useRef({
    type: 'deposit',
    populate: ['uid', 'token'],
  })

  async function deleteTransaction(transactionId) {
    const fetchData = {
      url: TRANSACTION + transactionId,
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

  async function confirmTransaction(transactionId, status) {
    const fetchData = {
      url: CREATE_TRANSACTION,
      method: 'PATCH',
      data: {
        id: transactionId,
        status,
      },
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
      setReload(!reload)
      toast.success(data.data.message)
    }
  }

  function out(rowData, rowIndex) {
    return (
      <ButtonGroup size="sm">
        {rowData?.status == PENDING_APPROVAL ? (
          <>
            <Button
              onClick={() => {
                confirmTransaction(rowData._id, ACTIVE)
              }}
              style={{ padding: '5px' }}
              title="Confirm this transaction"
              variant="success"
            >
              <FaCheck />
            </Button>
            <Button
              onClick={() => {
                confirmTransaction(rowData._id, INACTIVE)
              }}
              style={{ padding: '5px' }}
              title="Cancel this transaction"
              variant="primary"
            >
              <FaTimes />
            </Button>
          </>
        ) : null}
        <Button
          onClick={() => {
            setShowConfirmDeletion(true)
            setItemId(rowData._id)
          }}
          style={{ padding: '5px' }}
          title="Delete this transaction"
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
          title="Edit this transaction"
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
        onAccept={() => deleteTransaction(itemId)}
        header={<h2 className="text-center">Confirm Deletion</h2>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this transaction</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
        }}
        control={false}
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'}`} Transaction Token</h2>}
        backdrop
      >
        <TransactionForm setReload={(e) => setReload(!reload)} data={updatingData} />
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="transactions"
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

export default DepositTab
