import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import './styles'

import { Router, store, SystemTheme } from './app'

const rootElement = window.document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <SystemTheme />
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>
)
