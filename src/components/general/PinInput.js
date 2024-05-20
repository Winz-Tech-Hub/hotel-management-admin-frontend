import React, { useEffect, useMemo, useRef } from 'react'
import { Col, Row } from 'react-bootstrap'

function PinInput({ setPin, setDone, length = 4 }) {
  const inputsRef = useRef([])

  const inputElements = useMemo(() => {
    inputsRef.current = []
    const inputs = []
    length < 4 && (length = 4)

    for (let index = 0; index < length; index++) {
      const inputRef = useRef(null)
      inputs.push(
        <input
          ref={inputRef}
          style={{
            width: 50,
            height: 50,
            fontSize: 'x-large',
            '-webkit-text-security': 'square',
          }}
          onChange={(e) => inputChange(e, index)}
          type="text"
          min={1}
          max={1}
          className="text-center fw-bold"
          autoComplete="false"
        />,
      )
      inputsRef.current.push(inputRef)
    }
    //inputs[0]?.focus();
    return inputs
  }, [length])

  useEffect(() => {
    if (inputsRef?.current?.length !== 0) {
      gen(0)
    }
  }, [inputsRef])

  function gen(index) {
    if (index < length) {
      inputsRef.current[index]?.current?.focus()
    } else {
      let pin = ''
      for (const { current } of inputsRef.current) {
        pin += current?.value || ''
      }

      setPin && setPin(pin)
      setDone && setDone(pin)
    }
    return inputsRef.current[index]?.current
  }

  function inputChange(e, index) {
    e.preventDefault()
    const val = e.target.value
    if ((val && Number.parseInt(val)) || val == 0 || val == '0') {
      gen(index + 1)
    } else {
      e.target.value = ''
      return
    }
  }

  return (
    <Row>
      <Col xs="12" className="s-grid">
        {inputElements}
      </Col>
    </Row>
  )
}

export default PinInput
