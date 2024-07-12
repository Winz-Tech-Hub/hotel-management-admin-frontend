/* eslint-disable eqeqeq */
import React, { useRef, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { ALL_RESTAURANT_SALE, CREATE_RESTAURANT_SALE, RESTAURANT_SALE } from '../../../scripts/config/RestEndpoints'
import { ACTIVE, INACTIVE } from '../../../scripts/config/contants'
import fetcher from '../../../scripts/SharedFetcher'
import ModalBox from '../../general/Modal'
import PaginatedTable from '../../paginating/PaginatedTable'
import DataDisplay from '../../paginating/DataDisplay'

function RestaurantSale() {
  const [reload, setReload] = useState(false)
  const [restaurantSaleId, setRestaurantSaleId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [showConfirmCancel, setShowConfirmCancel] = useState(false)
  const [showSlip, setShowSlip] = useState(false)
  const [activeSlip, setActiveSlip] = useState({})

  const urlRef = useRef(ALL_RESTAURANT_SALE)

  const fieldsRef = useRef({
    _id: { name: 'ID', type: String },
    staff: {
      name: 'Staff',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.staff?._id}</div>
            <div className="fw-bold">{row?.staff?.firstname}</div>
          </>
        ),
      },
    },
    itemsAndQuantity: {
      name: 'Items & Quantity',
      type: Number,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.item?._id}</div>
            <div className="fw-bold">{row?.item?.name}</div>
          </>
        ),
      },
    },
    amount: { name: 'Amount', type: Number },
    department: { name: 'Department', type: String },
    status: { name: 'Status', type: String },
    'createdAt.date': { name: 'Created', type: Date },
    'updatedAt.date': { name: 'Updated', type: Date, hideFromSearch: true },
    action: {
      name: '',
      type: String,
      virtual: true,
      transform: { out },
    },
  })

  const queryRef = useRef({
    populate: ['itemsAndQuantity.item'],
  })

  async function deleteRestaurantSale(restaurantSaleId) {
    const fetchData = {
      url: RESTAURANT_SALE + restaurantSaleId,
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

  async function cancelRestaurantSale(restaurantSaleId) {
    const fetchData = {
      url: CREATE_RESTAURANT_SALE,
      method: 'POST',
      data: {
        id: restaurantSaleId,
        status: INACTIVE,
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
      setShowConfirmCancel(false)
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
            setRestaurantSaleId(rowData._id)
          }}
          style={{ padding: '5px' }}
          title="Delete this restaurant sale"
          variant="danger"
        >
          <Delete />
        </Button>
        {rowData.status == ACTIVE && (
          <Button
            onClick={() => {
              setShowConfirmCancel(true)
              setRestaurantSaleId(rowData._id)
            }}
            style={{ padding: '5px' }}
            title="Cancel this restaurant sale"
            variant="warning"
          >
            <i className="fas fa-times"></i>
          </Button>
        )}
      </ButtonGroup>
    )
  }
  return (
    <>
      <ModalBox
        show={showSlip}
        onCancel={() => setShowSlip(false)}
        onAccept={() => setShowSlip(false)}
        header={<h2 className="text-center">Sale Slip</h2>}
        noControl
        type="danger"
        backdrop
      >
        <DataDisplay data={activeSlip} />
      </ModalBox>

      <ModalBox
        show={showConfirmDeletion}
        onCancel={() => setShowConfirmDeletion(false)}
        onAccept={() => deleteRestaurantSale(restaurantSaleId)}
        header={<h2 className="text-center">Confirm Deletion</h2>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this restaurant sale</span>
      </ModalBox>

      <ModalBox
        show={showConfirmCancel}
        onCancel={() => setShowConfirmDeletion(false)}
        onAccept={() => cancelRestaurantSale(restaurantSaleId)}
        header={<h2 className="text-center">Confirm Cancel</h2>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to cancel this restaurant sale</span>
      </ModalBox>

      <PaginatedTable
        style={{
          theadStyle: {
            fontSize: '16px',
          },
          tbodyStyle: {
            fontSize: '14px',
          },
        }}
        rowOptions={(rowData) => ({
          onClick: (e) => {
            setActiveSlip(rowData)
            setShowSlip(true)
            e.stopPropagation()
          },
          style: {
            cursor: 'pointer',
          },
        })}
        url={urlRef.current}
        dataName="restaurantSales"
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

export default RestaurantSale
