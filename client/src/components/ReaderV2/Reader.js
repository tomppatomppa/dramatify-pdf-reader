import 'core-js'
import React, { useReducer } from 'react'

import ReaderContext from './contexts/ReaderContext'
import optionsReducer from './reducers/optionsReducer'

const initialState = {
  showAll: false,
  highlight: [],
  settings: {
    info: {
      style: {
        textAlign: 'left',
        marginLeft: '10px',
        fontStyle: 'italic',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
    actor: {
      style: {
        textAlign: 'center',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
  },
}

const Reader = ({ selected, children }) => {
  const [options, dispatch] = useReducer(optionsReducer, initialState)

  if (!selected) {
    return null
  }
  return (
    <ReaderContext.Provider value={{ options, dispatch }}>
      <div className="mx-auto max-w-2xl">{selected.data}</div>
      {children}
    </ReaderContext.Provider>
  )
}

export default Reader
