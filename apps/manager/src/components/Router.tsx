import { type ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { RouterPath } from '@/src/constants'

import { FeatureLoader } from './FeatureLoader'
import { Layout } from './Layout'
import { NotFound } from './NotFound'

export function Router(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<FeatureLoader />}>
          <Route element={<Layout />} path={RouterPath.Home} />
          <Route element={<Layout />} path={RouterPath.Metrics} />
          <Route element={<Layout />} path={RouterPath.Notes} />
          <Route element={<Layout />} path={RouterPath.Reviews} />
          <Route element={<Layout />} path={RouterPath.Programs} />
          <Route element={<Layout />} path={RouterPath.AthleteHome} />
          <Route element={<Layout />} path={RouterPath.AthleteMetrics} />
          <Route element={<Layout />} path={RouterPath.AthleteNotes} />
          <Route element={<Layout />} path={RouterPath.AthleteReviews} />
          <Route element={<Layout />} path={RouterPath.AthletePrograms} />
        </Route>
        <Route element={<NotFound />} path="*" />
      </Routes>
    </BrowserRouter>
  )
}
