/* eslint-disable eqeqeq */
import React, { useRef, useState } from 'react'
import { ALL_DEPARTMENT, DEPARTMENT } from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'
import ModalBox from '../../general/Modal'
import { Button, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import DepartmentForm from './department/DepartmentForm'
import { FaTrash } from 'react-icons/fa'

function Department() {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_DEPARTMENT)

  const fieldsRef = useRef({
    _id: { name: 'ID', type: String },
    groupName: { name: 'Name', type: String },
    groupPosition: { name: 'Position', type: Number },
    groupDescription: { name: 'Description', type: String },
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
          title="Fund User"
          variant="warning"
        >
          <i className="fas fa-user"></i> Fund
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

  const queryRef = useRef({})

  async function deleteDepartment(transactionId) {
    const fetchData = {
      url: DEPARTMENT + transactionId,
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
        onAccept={() => deleteDepartment(itemId)}
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
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'}`} Department</h2>}
        backdrop
      >
        {!updatingData ? (
          <DepartmentForm />
        ) : (
          <DepartmentForm setReload={() => setReload(!reload)} data={updatingData} />
        )}
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="predictionCategories"
        fields={fieldsRef.current}
        query={queryRef.current}
        primaryKey="groupPosition"
        sortOrder={DESCENDING}
        forCurrentUser={false}
        reload={reload}
      />
    </>
  )
}

export default Department
