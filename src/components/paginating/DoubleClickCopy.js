/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ClickCopy, { clipCopy } from '../general/ClickCopy'
import { Button } from 'react-bootstrap'
import ModalBox from '../general/Modal'

function DoubleClickCopy(props) {
  const wrapperRef = useRef(null)
  const [msg, setMsg] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    msg && toast.dark(msg)
  }, [msg])

  return (
    <>
      <span
        ref={wrapperRef}
        onClick={!props.noClickOpen ? () => setOpen(true) : undefined}
        onDoubleClick={() => clipCopy(wrapperRef.current.innerText, setMsg)}
        className="c-pointer"
        title="Double click to copy the content"
      >
        {props.children}
      </span>
      {!open ? null : (
        <ModalBox show={open} onCancel={() => setOpen(false)} noControl noHeader backdrop>
          <div className="s-300h">
            <div dangerouslySetInnerHTML={{ __html: wrapperRef.current.innerText }}></div>
          </div>
          <div>
            <Button variant="outline-info">
              <ClickCopy text={wrapperRef.current.innerText} />
            </Button>
          </div>
        </ModalBox>
      )}
    </>
  )
}

export default DoubleClickCopy
