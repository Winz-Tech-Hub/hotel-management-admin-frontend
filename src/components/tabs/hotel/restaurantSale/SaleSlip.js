/* eslint-disable react/prop-types */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from 'react'
import { Card, Divider, Grid, Input, Link } from '@mui/material'
import { RemoveCircleOutline } from '@mui/icons-material'
import { SITE_TITLE } from '../../../../scripts/config/contants'
import SharedConfig from '../../../../scripts/SharedConfig'
import { camelCaseToTitleCase } from '../../../../scripts/misc'


function SaleSlip({ data = [], print, setQuantity, setItemsAndQuantity }) {
  const title = SharedConfig.getSessionData('SITE_TITLE') || SITE_TITLE
  const description = SharedConfig.getSessionData('SITE_TAGLINE') || 'Winz Tech Hub Hotel Management Software'

  // Render the card info items
  const renderItems = data.map((itemAndQuantity) => (
    <MDBox key={itemAndQuantity.item._id} display="flex" py={1} pr={2} sx={{ borderBottom: '1px solid blue' }}>
      <MTypography variant="button" fontWeight="bold" textTransform="capitalize">
        {camelCaseToTitleCase(itemAndQuantity.item.name)}: &nbsp;
      </MTypography>
      <MDTypography variant="button" fontWeight="regular" color="text">
        &nbsp;{' '}
        <Input
          type="number"
          value={itemAndQuantity.quantity}
          readOnly={!setQuantity}
          onChange={(e) => setQuantity && setQuantity({ item: itemAndQuantity.item, quantity: e.target.value })}
        />
      </MDTypography>
      {setItemsAndQuantity && (
        <MDTypography
          variant="button"
          fontWeight="regular"
          color="text"
          onClick={() => setItemsAndQuantity && setItemsAndQuantity({ item: itemAndQuantity.item })}
        >
          <RemoveCircleOutline />
        </MDTypography>
      )}
    </MDBox>
  ))

  return (
    <Card id="print">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * {
                visibility: hidden;
              }
              #print,
              #print * {
                visibility: visible;
              }
              #print {
                position: fixed;
                left: 0;
                right: 0;
                top: 0;
                /* width: max-content; */
                page-break-inside: avoid;
                margin: 20px 10px;
                padding: 2px 5px;
              }
              .print-button {
                display: none;
              }
            }
      `,
        }}
      />
      <Grid container direction={'row'} alignContent={'center'} alignSelf={'center'} alignItems={`center`}>
        <Grid item xs={3}>
          <MDTypography className="text-center">
            <img
              alt="Icon"
              src={SharedConfig.getSessionData('SITE_FAVICON') || './favicon.png'}
              style={{ maxWidth: 100 }}
            />
          </MDTypography>
        </Grid>
        <Grid alignItems={'center'} alignContent={'center'} item xs={9}>
          <MDTypography variant="h4" fontWeight="medium" textTransform="capitalize">
            {title}
          </MDTypography>
          <MDTypography variant="h6" color="text" fontWeight="light">
            {description}
          </MDTypography>
        </Grid>
      </Grid>

      {print ? (
        <MDBox p={2}>
          <MDBox opacity={0.5} sx={{ py: 0, my: 0 }}>
            <Divider />
          </MDBox>
          <MDBox>{renderItems}</MDBox>
          <MDBox sx={{ mt: 2 }} className="print-button">
            <MDButton sx={{ float: 'left' }} color="info" onClick={() => window.print()}>
              Print
            </MDButton>
            <Link href="/home" color="info" sx={{ float: 'right' }}>
              Done
            </Link>
          </MDBox>
        </MDBox>
      ) : null}
    </Card>
  )
}

export default SaleSlip
