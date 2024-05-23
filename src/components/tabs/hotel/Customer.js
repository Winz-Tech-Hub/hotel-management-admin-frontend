/* eslint-disable eqeqeq */
import React, { useRef, useState } from 'react'
import { ALL_CUSTOMER, CUSTOMER } from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'
import { FaTrash } from 'react-icons/fa'
import ModalBox from '../../general/Modal'
import { Button, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import CustomerForm from './customer/CustomerForm'

function Customer() {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_CUSTOMER)

  const fieldsRef = useRef({
    _id: { name: 'ID', type: String },
    phone: {
      name: 'Phone',
      type: String,
    },
    address: { name: 'Address', type: String },
    name: { name: 'Name', type: String },
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
          title="Create new customer"
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

  async function deleteCustomer(customerId) {
    const fetchData = {
      url: CUSTOMER + customerId,
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
          title="Delete this customer"
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
          title="Edit this customer"
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
        onAccept={() => deleteCustomer(itemId)}
        header={<h2 className="text-center">Confirm Deletion</h2>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this customer</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
        }}
        control={false}
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'}`} Customer</h2>}
        backdrop
      >
        {!updatingData ? <CustomerForm /> : <CustomerForm setReload={() => setReload(!reload)} data={updatingData} />}
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="customers"
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

export default Customer
