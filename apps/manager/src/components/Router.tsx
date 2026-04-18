import { type ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { RouterPath } from '@/src/constants'

import { Layout } from './Layout'
import { NotFound } from './NotFound'

export function Router(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} path={RouterPath.Home} />
        <Route element={<Layout />} path={RouterPath.Metrics} />
        <Route element={<Layout />} path={RouterPath.Notes} />
        <Route element={<Layout />} path={RouterPath.Reviews} />
        <Route element={<Layout />} path={RouterPath.Programs} />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </BrowserRouter>
  )
}
