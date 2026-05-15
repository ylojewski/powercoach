import { act, renderHook, waitFor } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { Provider } from 'react-redux'

import { createStore } from '@/app'
import { type GetReferencesApiResponse } from '@/core'

import { useReferences } from './useReferences'

const referencesResponse = {
  disciplines: [],
  exerciseMuscles: [],
  exercisePatterns: [],
  exerciseRelationships: [],
  exerciseRoles: [],
  exercises: [
    {
      archivedAt: null,
      bodyweightCoefficient: null,
      code: 'competition_squat',
      createdAt: '2024-01-01T00:00:00.000Z',
      descriptionMarkdown: null,
      id: 1,
      imageUrl: null,
      isSystem: true,
      isUnilateral: false,
      loadingTypeId: 1,
      publicationStatus: 'published',
      shortInstructionsMarkdown: null,
      subtitle: null,
      title: 'Competition squat',
      updatedAt: '2024-01-01T00:00:00.000Z',
      videoUrl: null
    }
  ],
  loadingTypes: [],
  muscleRoles: [],
  muscles: [],
  patterns: []
} satisfies GetReferencesApiResponse

function createReferencesResponse(): Response {
  return new Response(JSON.stringify(referencesResponse), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  })
}

function createWrapper(): ({ children }: PropsWithChildren) => ReactElement {
  const store = createStore()

  return function Wrapper({ children }: PropsWithChildren): ReactElement {
    return <Provider store={store}>{children}</Provider>
  }
}

describe('useReferences', () => {
  afterEach(() => {
    vi.resetAllMocks()
    vi.unstubAllGlobals()
  })

  it('exposes the loading state before references are loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => new Promise<Response>(() => undefined))
    )

    const { result } = renderHook(() => useReferences(), {
      wrapper: createWrapper()
    })

    act(() => {
      result.current.load()
    })

    await waitFor(() => {
      expect(result.current).toStrictEqual({
        load: expect.any(Function),
        loading: true,
        references: null
      })
    })
  })

  it('exposes the loaded references', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createReferencesResponse()))

    const { result } = renderHook(() => useReferences(), {
      wrapper: createWrapper()
    })

    act(() => {
      result.current.load()
    })

    await waitFor(() => {
      expect(result.current).toStrictEqual({
        load: expect.any(Function),
        loading: false,
        references: referencesResponse
      })
    })
  })

  it('exposes the idle state before references load starts', () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createReferencesResponse()))

    const { result } = renderHook(() => useReferences(), {
      wrapper: createWrapper()
    })

    expect(result.current).toStrictEqual({
      load: expect.any(Function),
      loading: false,
      references: null
    })
  })

  it('exposes the error state when references cannot be loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), {
          headers: { 'Content-Type': 'application/json' },
          status: 500
        })
      )
    )

    const { result } = renderHook(() => useReferences(), {
      wrapper: createWrapper()
    })

    act(() => {
      result.current.load()
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })
})
