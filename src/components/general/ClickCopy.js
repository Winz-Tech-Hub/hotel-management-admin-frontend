/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'

function ClickCopy({ text, title = 'Copy' }) {
  const [msg, setMsg] = useState(title)

  useEffect(() => {
    if (msg !== 'Copy') {
      setTimeout(() => {
        setMsg(title)
      }, 2000)
    }
  }, [msg])

  return (
    <span onClick={() => clipCopy(text, setMsg)} className="c-pointer">
      {msg}
    </span>
  )
}

export const fallbackCopyTextToClipboard = (text) => {
  const textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
  } catch (error) {
  } finally {
    document.body.removeChild(textArea)
  }
}

export const clipCopy = (text, setMsg = (msg) => {}) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then((_result) => {
        setMsg('Copied')
      })
      .catch((_err) => {
        setMsg('Could not copy text')
      })
  } else {
    fallbackCopyTextToClipboard(text)
    setMsg('Copied')
  }
}

export default ClickCopy
