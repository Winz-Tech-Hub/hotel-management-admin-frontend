import React, { createContext } from 'react'
const ParamContext = createContext()
const ParamConsumer = ParamContext.Consumer
const ParamProvider = ParamContext.Provider
export { ParamConsumer, ParamProvider }
export const consume = (props) => (
  <>
    <ParamConsumer>{(param) => props.children}</ParamConsumer>
  </>
)
export const provide = (props) => (
  <>
    <ParamProvider value={props.param}>{props.children}</ParamProvider>
  </>
)
