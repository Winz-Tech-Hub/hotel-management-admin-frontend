/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { ALL_TOKEN, TOKEN } from '../../../scripts/config/RestEndpoints'
import PaginatedTable from '../../paginating/PaginatedTable'
import ModalBox from '../../general/Modal'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import TokenForm from './token_tab_components/TokenForm'
import { FaTrash } from 'react-icons/fa'

function TokenTab(props) {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_TOKEN)
  const fieldRef = useRef({
    _id: { name: 'Token Id', type: String },
    network: {
      name: 'Supported Network Id',
      type: String,
      transform: {
        out: (rowData) => {
          return (
            <>
              <div className="text-center fw-bold">{rowData?.network?.name}</div>
              <div className="text-center">{rowData?.network?._id}</div>
            </>
          )
        },
      },
    },
    name: { name: 'Name', type: String },
    value: { name: 'Value in USD', type: Number },
    symbol: { name: 'Token Symbol', type: String },
    'createdAt.date': { name: 'Created', type: Date },
    'updatedAt.date': { name: 'Updated', type: Date, hideFromSearch: true },
    action: {
      name: createTokenButton,
      type: String,
      virtual: true,
      transform: { out },
    },
  })

  const queryRef = useRef({
    populate: ['network'],
  })

  async function deleteToken(tokenId) {
    const fetchData = {
      url: TOKEN + tokenId,
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
          style={{ padding: '5px' }}
          title="Delete this token"
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
          title="Edit this token"
          variant="warning"
        >
          <i className="fas fa-edit"></i>
        </Button>
      </ButtonGroup>
    )
  }

  function createTokenButton() {
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
        header={<h1 className="text-center">Confirm Deletion</h1>}
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
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'} Token`}</h2>}
        backdrop
      >
        <TokenForm setReload={(e) => setReload(!reload)} data={updatingData} />
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="tokens"
        fields={fieldRef.current}
        primaryKey="name"
        query={queryRef.current}
        /* setData={data => setData(data)} */ forCurrentUser={false}
        reload={reload}
      />
    </>
  )
}

export default TokenTab
