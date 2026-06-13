import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { type ReactNode } from 'react'
import { Provider } from 'react-redux'

import { type Exercise, type GetReferencesApiResponse } from '@/core'
import { useReferences } from '@/modules/references'
import { createTestStore } from '@/test/utils/store'

import { CreationMethod, type CreationExerciseRelationship, startCreation } from '../store'
import { NewExerciseCategorizationStep } from './NewExerciseCategorizationStep'

vi.mock('@powercoach/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@powercoach/ui')>()
  const { createElement } = await import('react')

  function Slider(props: Record<string, unknown>) {
    const { children, onValueChange, onValueCommitted } = props as {
      children?: ReactNode
      onValueChange?: (value: number) => void
      onValueCommitted?: (value: number) => void
    }

    return createElement(
      'div',
      { 'data-testid': 'transfer-slider' },
      createElement(
        'button',
        {
          key: 'change',
          onClick: () => onValueChange?.(50),
          type: 'button'
        },
        'Drag transfer'
      ),
      createElement(
        'button',
        {
          key: 'commit',
          onClick: () => onValueCommitted?.(50),
          type: 'button'
        },
        'Commit transfer'
      ),
      children
    )
  }

  function SliderValue(props: Record<string, unknown>) {
    const { children, ...spanProps } = props as {
      children?: ((context: unknown, values: number[]) => ReactNode) | ReactNode
    }

    return createElement(
      'span',
      spanProps,
      typeof children === 'function' ? children(null, [0]) : children
    )
  }

  return {
    ...actual,
    Slider,
    SliderValue
  }
})

vi.mock('@/modules/references', () => ({
  useReferences: vi.fn()
}))

const references = {
  disciplineMovements: [
    {
      code: 'squat',
      description: 'Primary knee-dominant movement.',
      disciplineId: 1,
      id: 1,
      name: 'Squat',
      sortOrder: 1
    },
    {
      code: 'carry',
      description: 'Loaded carry event family.',
      disciplineId: 2,
      id: 2,
      name: 'Carry',
      sortOrder: 1
    }
  ],
  disciplines: [
    {
      code: 'powerlifting',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Powerlifting',
      id: 1,
      name: 'Powerlifting',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      code: 'strongman',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Strongman',
      id: 2,
      name: 'Strongman',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  exerciseMuscles: [],
  exerciseRelationships: [],
  exerciseRoles: [
    {
      code: 'competition',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Competition execution.',
      id: 1,
      name: 'Competition',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  exercises: [],
  loadingTypes: [],
  muscleRoles: [],
  muscles: [],
  patterns: [
    {
      code: 'squat',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Squat pattern.',
      id: 1,
      name: 'Squat',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]
} satisfies GetReferencesApiResponse

const useReferencesMock = vi.mocked(useReferences)

function createExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    archivedAt: null,
    bodyweightCoefficient: null,
    code: '',
    createdAt: '2024-01-01T00:00:00.000Z',
    descriptionMarkdown: null,
    id: 1,
    imageUrl: null,
    isSystem: false,
    isUnilateral: false,
    loadingTypeId: 1,
    patternId: null,
    publicationStatus: 'draft',
    shortInstructionsMarkdown: null,
    subtitle: null,
    title: '',
    updatedAt: '2024-01-01T00:00:00.000Z',
    videoUrl: null,
    ...overrides
  }
}

function renderCategorizationStep(relationships: CreationExerciseRelationship[] = []) {
  const store = createTestStore()

  store.dispatch(
    startCreation({
      currentExercise: createExercise(),
      currentExerciseRelationships: relationships,
      initialExercise: createExercise(),
      initialExerciseRelationships: relationships,
      method: CreationMethod.Blank
    })
  )

  const rendered = render(
    <Provider store={store}>
      <NewExerciseCategorizationStep />
    </Provider>
  )

  return { store, ...rendered }
}

function getActivePanel(container: HTMLElement) {
  const activePanel = container.querySelector<HTMLElement>(
    '[data-slot="stacked-panel-content"][data-active]'
  )

  if (!activePanel) {
    throw new Error('Expected an active stacked panel content')
  }

  return within(activePanel)
}

describe('NewExerciseCategorizationStep', () => {
  beforeEach(() => {
    useReferencesMock.mockReturnValue({
      exerciseGroupItemsByPattern: [],
      load: vi.fn(),
      loading: false,
      references
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('lets the user navigate panels independently from the recommended active discipline', async () => {
    renderCategorizationStep([
      {
        defaultTransferCoefficient: 0.5,
        disciplineCode: 'powerlifting',
        roleId: 1,
        targetDisciplineMovementId: 1
      }
    ])

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'powerlifting' })).toHaveAttribute(
        'aria-selected',
        'true'
      )
    })

    fireEvent.click(screen.getByRole('tab', { name: 'strongman' }))

    expect(screen.getByRole('tab', { name: 'strongman' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'powerlifting' })).toHaveAttribute(
      'aria-selected',
      'false'
    )
  })

  it('upserts movement and role together, then stores transfer only on commit', () => {
    const { container, store } = renderCategorizationStep()

    fireEvent.click(screen.getByRole('tab', { name: 'powerlifting' }))

    fireEvent.click(getActivePanel(container).getByRole('button', { name: 'Select Squat' }))

    expect(store.getState().exercises?.creation.current?.exerciseRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0,
        disciplineCode: 'powerlifting',
        targetDisciplineMovementId: 1
      }
    ])

    fireEvent.click(getActivePanel(container).getByRole('button', { name: 'Select Competition' }))

    expect(store.getState().exercises?.creation.current?.exerciseRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0,
        disciplineCode: 'powerlifting',
        roleId: 1,
        targetDisciplineMovementId: 1
      }
    ])

    fireEvent.click(screen.getByRole('button', { name: 'Drag transfer' }))

    expect(store.getState().exercises?.creation.current?.exerciseRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0,
        disciplineCode: 'powerlifting',
        roleId: 1,
        targetDisciplineMovementId: 1
      }
    ])

    fireEvent.click(screen.getByRole('button', { name: 'Commit transfer' }))

    expect(store.getState().exercises?.creation.current?.exerciseRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0.5,
        disciplineCode: 'powerlifting',
        roleId: 1,
        targetDisciplineMovementId: 1
      }
    ])

    fireEvent.click(getActivePanel(container).getByRole('button', { name: 'Select Competition' }))

    expect(store.getState().exercises?.creation.current?.exerciseRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0,
        disciplineCode: 'powerlifting',
        targetDisciplineMovementId: 1
      }
    ])

    fireEvent.click(getActivePanel(container).getByRole('button', { name: 'Select Competition' }))
    fireEvent.click(screen.getByRole('button', { name: 'Commit transfer' }))

    expect(store.getState().exercises?.creation.current?.exerciseRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0.5,
        disciplineCode: 'powerlifting',
        roleId: 1,
        targetDisciplineMovementId: 1
      }
    ])

    fireEvent.click(getActivePanel(container).getByRole('button', { name: 'Select Squat' }))

    expect(store.getState().exercises?.creation.current?.exerciseRelationships).toStrictEqual([])
  })
})
