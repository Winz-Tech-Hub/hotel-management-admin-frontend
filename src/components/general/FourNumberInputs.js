import React, { useState } from 'react'

const FourNumberInputs = ({ setPin, setDone }) => {
  const [inputs, setInputs] = useState(['', '', '', ''])

  const handleChange = (index, value) => {
    const sanitizedValue = value.replace(/\D/g, '') // Remove non-numeric characters
    setInputs((prevInputs) => {
      const newInputs = [...prevInputs]
      newInputs[index] = sanitizedValue
      //index !== 0 && inputElements[index].focus();
      4 - 1 == index && setPin && setPin()
      4 - 1 == index && setDone && setDone()

      return newInputs
    })
  }

  return (
    <div>
      <h2>Enter Four Numbers</h2>
      {inputs.map((input, index) => (
        <input
          key={index}
          type="text"
          value={input}
          onChange={(e) => handleChange(index, e.target.value)}
          maxLength="1"
          autoComplete="off"
        />
      ))}
    </div>
  )
}

export default FourNumberInputs
