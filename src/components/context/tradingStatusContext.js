/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */

import React, { createContext, useReducer } from 'react'
import { toast } from 'react-toastify'

const initalState = {
  trading: false,
  error: '',
  success: '',
  loader: '',
}

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, trading: true, loader: action.payload }

    case 'STOP':
      return {}

    case 'SUCCESS':
      return { ...state, success: action.payload }

    case 'DONE':
      toast.success(state.success)
      return { trading: false, success: '', loader: '', error: '' }

    case 'ERROR':
      toast.error(action.payload)
      return { trading: false }

    default:
      return state
  }
}

const StateContext = createContext()

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initalState)

  return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>
}

export { StateContext, StateProvider }
