import { act, renderHook, waitFor } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { Provider } from 'react-redux'

import { createStore } from '@/app'
import { type GetReferencesApiResponse } from '@/core'

import { useReferences } from './useReferences'

const referencesResponse = {
  disciplineMovements: [],
  disciplines: [],
  exerciseMuscles: [],
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
      patternId: 2,
      publicationStatus: 'published',
      shortInstructionsMarkdown: null,
      subtitle: null,
      title: 'Competition squat',
      updatedAt: '2024-01-01T00:00:00.000Z',
      videoUrl: null
    },
    {
      archivedAt: null,
      bodyweightCoefficient: null,
      code: 'bench_press',
      createdAt: '2024-01-01T00:00:00.000Z',
      descriptionMarkdown: null,
      id: 2,
      imageUrl: null,
      isSystem: true,
      isUnilateral: false,
      loadingTypeId: 1,
      patternId: 1,
      publicationStatus: 'published',
      shortInstructionsMarkdown: null,
      subtitle: null,
      title: 'Bench press',
      updatedAt: '2024-01-01T00:00:00.000Z',
      videoUrl: null
    },
    {
      archivedAt: null,
      bodyweightCoefficient: null,
      code: 'back_squat',
      createdAt: '2024-01-01T00:00:00.000Z',
      descriptionMarkdown: null,
      id: 3,
      imageUrl: null,
      isSystem: true,
      isUnilateral: false,
      loadingTypeId: 1,
      patternId: 2,
      publicationStatus: 'published',
      shortInstructionsMarkdown: null,
      subtitle: null,
      title: 'Back squat',
      updatedAt: '2024-01-01T00:00:00.000Z',
      videoUrl: null
    }
  ],
  loadingTypes: [],
  muscleRoles: [],
  muscles: [],
  patterns: [
    {
      code: 'squat',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: '',
      id: 2,
      name: 'Squat',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      code: 'press',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: '',
      id: 1,
      name: 'Press',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]
} satisfies GetReferencesApiResponse

const exerciseGroupItemsByPattern = [
  {
    code: 'press',
    items: [referencesResponse.exercises[1]],
    value: 'Press'
  },
  {
    code: 'squat',
    items: [referencesResponse.exercises[2], referencesResponse.exercises[0]],
    value: 'Squat'
  }
]

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
    vi.useRealTimers()
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
        exerciseGroupItemsByPattern: [],
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

    let unloadReferences: VoidFunction | undefined

    act(() => {
      unloadReferences = result.current.load()
    })

    await waitFor(() => {
      expect(result.current).toStrictEqual({
        exerciseGroupItemsByPattern,
        load: expect.any(Function),
        loading: false,
        references: referencesResponse
      })
    })

    act(() => {
      unloadReferences?.()
    })
  })

  it('shares loaded references between hook instances', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createReferencesResponse()))

    const { result } = renderHook(
      () => ({
        loader: useReferences(),
        reader: useReferences()
      }),
      {
        wrapper: createWrapper()
      }
    )

    let unloadReferences: VoidFunction | undefined

    act(() => {
      unloadReferences = result.current.loader.load()
    })

    await waitFor(() => {
      expect(result.current.reader.references).toStrictEqual(referencesResponse)
    })

    act(() => {
      unloadReferences?.()
    })
  })

  it('exposes the idle state before references load starts', () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createReferencesResponse()))

    const { result } = renderHook(() => useReferences(), {
      wrapper: createWrapper()
    })

    expect(result.current).toStrictEqual({
      exerciseGroupItemsByPattern: [],
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

    let unloadReferences: VoidFunction | undefined

    act(() => {
      unloadReferences = result.current.load()
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      unloadReferences?.()
    })
  })
})
