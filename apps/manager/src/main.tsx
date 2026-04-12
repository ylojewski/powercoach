import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles'

import { Router } from './components/Router'

const rootElement = window.document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
)
