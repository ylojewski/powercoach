import { type ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { routerPaths } from '@/src/constants/router-paths'

import { Layout } from './Layout'
import { NotFound } from './NotFound'

export { panelPaths, routerPaths } from '@/src/constants/router-paths'

export function Router(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} path={routerPaths.home} />
        <Route element={<Layout />} path={routerPaths.metrics} />
        <Route element={<Layout />} path={routerPaths.notes} />
        <Route element={<Layout />} path={routerPaths.reviews} />
        <Route element={<Layout />} path={routerPaths.programs} />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </BrowserRouter>
  )
}
