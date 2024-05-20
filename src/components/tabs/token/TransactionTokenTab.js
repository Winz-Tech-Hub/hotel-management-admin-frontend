/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { ALL_TOKEN, ALL_TRANSACTION_TOKEN, TRANSACTION_TOKEN } from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'
import ModalBox from '../../general/Modal'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import TransactionTokenForm from './transaction_token_tab_components/TransactionTokenForm'
import { FaTrash } from 'react-icons/fa'
import { encodeQuery } from '../../../scripts/misc'

function TransactionTokenTab(props) {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const refGetter = () => useRef(null)

  const urlRef = useRef(ALL_TRANSACTION_TOKEN)

  const queryRef = useRef({
    populate: ['token'],
  })

  const fieldRef = useRef({
    _id: { name: 'Id', type: String },
    token: {
      name: 'Token',
      type: String,
      transform: {
        out: (rowData) => {
          const networkContainer = refGetter()
          const query = encodeQuery({
            _id: rowData?.token?._id,
            populate: ['network'],
          })
          fetcher.fetch(ALL_TOKEN + '?size=500&q=' + query).then((data) => {
            networkContainer.current.innerHTML = data?.data?.tokens?.results[0]?.network?.name || '...'
          })

          return (
            <>
              <div className="text-center">{rowData?.token?._id}</div>
              <div className="text-center fw-bold">{rowData?.token?.name}</div>
              <div ref={networkContainer} className="text-center"></div>
            </>
          )
        },
      },
    },
    forDeposit: { name: 'For Deposit', type: Boolean },
    depositMin: { name: 'Deposit Min', type: Number },
    depositMax: { name: 'Deposit Max', type: Number },
    forWithdraw: { name: 'For Withdraw', type: Boolean },
    withdrawMin: { name: 'Withdraw Min', type: Number },
    withdrawMax: { name: 'Withdraw Max', type: Number },
    address: { name: 'Address', type: String },
    status: { name: 'Status', type: String },
    'createdAt.date': { name: 'Created', type: Date },
    'updatedAt.date': { name: 'Updated', type: Date, hideFromSearch: true },
    action: {
      name: createTransactionTokenButton,
      type: String,
      virtual: true,
      transform: { out },
    },
  })

  async function deleteToken(tokenId) {
    const fetchData = {
      url: TRANSACTION_TOKEN + tokenId,
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
          title="Delete this transaction token"
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
          title="Edit this transaction token"
          variant="warning"
        >
          <i className="fas fa-edit"></i>
        </Button>
      </ButtonGroup>
    )
  }

  function createTransactionTokenButton() {
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
        onAccept={() => deleteToken(itemId)}
        header={<h2 className="text-center">Confirm Deletion</h2>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this token</span>
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
        <TransactionTokenForm setReload={(e) => setReload(!reload)} data={updatingData} />
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="transactionTokens"
        fields={fieldRef.current}
        query={queryRef.current}
        primaryKey="createdAt.date"
        sortOrder={DESCENDING}
        /* setData={data => setData(data)} */ forCurrentUser={false}
        reload={reload}
      />
    </>
  )
}

export default TransactionTokenTab
