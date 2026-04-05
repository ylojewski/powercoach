import { type ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { App } from '@/src/components/App'
import { AppLayout } from '@/src/components/AppLayout'
import { NotFound } from '@/src/components/NotFound'

export function AppRouter(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route element={<App />} index />
        </Route>
        <Route element={<NotFound />} path="*" />
      </Routes>
    </BrowserRouter>
  )
}
