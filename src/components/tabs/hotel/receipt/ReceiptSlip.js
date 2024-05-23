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
import MDBox from '../../../MDBox'
import MDTypography from '../../../MDTypography'
import { Card, Divider } from '@mui/material'
import MDButton from '../../../MDButton'

function ReceiptSlip({ receiptData }) {
  const labels = []
  const values = []

  const title = 'Capito Hotel'
  const description = 'Hotel management software'

  // Convert this form `objectKey` of the object key in to this `object key`
  Object.keys(receiptData).forEach((el) => {
    if (el.match(/[A-Z\s]+/)) {
      const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/))
      const newElement = el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`)

      labels.push(newElement)
    } else {
      labels.push(el)
    }
  })

  // Push the object values into the values array
  Object.values(receiptData).forEach((el) => values.push(el))

  // Render the card info items
  const renderItems = labels.map((label, key) => (
    <MDBox key={label} display="flex" py={1} pr={2}>
      <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
        {label}: &nbsp;
      </MDTypography>
      <MDTypography variant="button" fontWeight="regular" color="text">
        &nbsp;{values[key]}
      </MDTypography>
    </MDBox>
  ))

  return (
    <Card id="print">
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
        </MDBox>
        <MDBox opacity={0.3}>
          <Divider />
        </MDBox>
        <MDBox>{renderItems}</MDBox>
        <MDBox sx={{ mt: 2 }} className="print-button">
          <MDButton sx={{ float: 'left' }} color="info" onClick={() => window.print()}>
            Print
          </MDButton>
        </MDBox>
      </MDBox>
    </Card>
  )
}

export default ReceiptSlip
