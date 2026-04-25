import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import './styles'

import { FeatureLoader } from './components/FeatureLoader'
import { Router } from './components/Router'
import { store } from './store'

const rootElement = window.document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <FeatureLoader>
        <Router />
      </FeatureLoader>
    </Provider>
  </React.StrictMode>
)
