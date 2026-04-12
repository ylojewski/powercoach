import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import { type ReactElement } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { PathnameProbe } from './PathnameProbe'

export interface RenderWithRouterOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntry?: string
  path?: string
  pathnameProbe?: boolean | string
}

export function renderWithRouter(
  ui: ReactElement,
  { initialEntry = '/', path = '*', pathnameProbe, ...renderOptions }: RenderWithRouterOptions = {}
): RenderResult {
  const resolvedPathnameProbeTestId =
    pathnameProbe === true ? 'pathname' : pathnameProbe || undefined

  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          element={
            <>
              {resolvedPathnameProbeTestId ? (
                <PathnameProbe testId={resolvedPathnameProbeTestId} />
              ) : null}
              {ui}
            </>
          }
          path={path}
        />
      </Routes>
    </MemoryRouter>,
    renderOptions
  )
}
