/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useEffect, useRef, useState } from 'react'
import Spinner from '../../general/Spinner'
import { USER_EXCHANGERS } from '../../../scripts/config/RestEndpoints'
import SharedConfig from '../../../scripts/SharedConfig'
import { UID } from '../../../scripts/config/contants'
import { Accordion, ListGroup, ListGroupItem } from 'react-bootstrap'
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader'
import AccordionBody from 'react-bootstrap/esm/AccordionBody'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'

function ExchangerTab() {
  const [exchangers, setExchangers] = useState([])
  const [loadingExchangers, setLoadingExchangers] = useState(true)
  const [loadingError, setLoadingError] = useState(false)
  const uidRef = useRef(SharedConfig.getLocalData(UID))

  useEffect(() => {
    async function getMyExchangers() {
      setLoadingExchangers(true)
      setLoadingError(false)
      let data
      try {
        data = await fetcher.fetch(USER_EXCHANGERS + `${uidRef.current}`)
      } catch (er) {
        setLoadingError(true)
        toast.error(er.message)
      }
      if (data) {
        if (!data.data.status) {
          setLoadingError(true)
          toast.error(data.data.message)
        } else {
          setExchangers(data.data.exchangers)
        }
      }
      setLoadingExchangers(false)
    }
    getMyExchangers()
  }, [])
  return (
    <Spinner loading={loadingExchangers} loadingText={`Loading...`} loadingError={loadingError}>
      <ListGroup numbered>
        {exchangers.map((exchanger, index) => (
          <ListGroupItem action key={exchanger.id}>
            <Accordion>
              <AccordionHeader>{exchanger.name}</AccordionHeader>
              <AccordionBody>{exchanger.description}</AccordionBody>
            </Accordion>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Spinner>
  )
}
{
  /* <div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button
        class="accordion-button"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseOne"
        aria-expanded="true"
        aria-controls="collapseOne"
      >
        Accordion Item #1
      </button>
    </h2>
    <div
      id="collapseOne"
      class="accordion-collapse collapse show"
      aria-labelledby="headingOne"
      data-bs-parent="#accordionExample"
    >
      <div class="accordion-body">This is the first item's accordion body.</div>
    </div>
  </div>
</div>;
 */
}
export default ExchangerTab
