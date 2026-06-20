import { fireEvent, render, screen } from '@testing-library/react'
import { DumbbellIcon } from 'lucide-react'

import { SelectableGrid, type SelectableGridItem } from './SelectableGrid'

const externalLoadItem = {
  code: 'external_load',
  description: 'Entered load is the load moved by the athlete.',
  name: 'External load'
} satisfies SelectableGridItem
const bodyweightItem = {
  code: 'bodyweight',
  description: 'Athlete bodyweight is the load.',
  name: 'Bodyweight'
} satisfies SelectableGridItem
const items = [externalLoadItem, bodyweightItem] satisfies SelectableGridItem[]

describe('SelectableGrid', () => {
  it('renders lucide icons from an item icon map', () => {
    render(
      <SelectableGrid
        emptyText="Please select a load type"
        items={items}
        itemsToIconMap={{ external_load: DumbbellIcon }}
        value={null}
      />
    )

    const externalLoad = screen.getByRole('button', { name: 'Select External load' })

    expect(externalLoad.querySelector('[data-slot="selectable-grid-icon"]')).toBeTruthy()
  })

  it('reports the selected item and marks it active', () => {
    const onValueChange = vi.fn()

    render(
      <SelectableGrid
        emptyText="Please select a load type"
        items={items}
        onValueChange={onValueChange}
        value={bodyweightItem}
      />
    )

    const bodyweight = screen.getByRole('button', { name: 'Select Bodyweight' })
    const externalLoad = screen.getByRole('button', { name: 'Select External load' })

    expect(bodyweight.getAttribute('aria-pressed')).toBe('true')

    fireEvent.pointerDown(externalLoad, { button: 0 })

    expect(onValueChange).toHaveBeenCalledWith(externalLoadItem)
  })

  it('prefers image URLs over icons when both maps provide media', () => {
    render(
      <SelectableGrid
        emptyText="Please select a load type"
        items={[externalLoadItem]}
        itemsToIconMap={{ external_load: DumbbellIcon }}
        itemsToUrlMap={{ external_load: '/external-load.png' }}
        value={externalLoadItem}
      />
    )

    const externalLoad = screen.getByRole('button', { name: 'Select External load' })

    expect(screen.getAllByAltText('External load')).toHaveLength(2)
    expect(externalLoad.querySelector('[data-slot="selectable-grid-icon"]')).toBeNull()
  })

  it('separates the description layout from the item orientation', () => {
    const cases = [
      {
        descriptionClassName: 'ms-px',
        gridClassName: 'grid-cols-[repeat(var(--cols),minmax(0,1fr))]',
        layout: 'horizontal',
        orientation: 'horizontal',
        rootClassName: 'flex-row-reverse'
      },
      {
        descriptionClassName: 'mt-px',
        gridClassName: 'grid-cols-[repeat(var(--cols),minmax(0,1fr))]',
        layout: 'vertical',
        orientation: 'horizontal',
        rootClassName: 'flex-col'
      },
      {
        descriptionClassName: 'grow',
        gridClassName: 'grid-cols-1',
        layout: 'vertical',
        orientation: 'vertical',
        rootClassName: 'flex-col'
      },
      {
        descriptionClassName: 'ms-px',
        gridClassName: 'grid-cols-1',
        layout: 'horizontal',
        orientation: 'vertical',
        rootClassName: 'flex-row-reverse'
      }
    ] as const

    for (const testCase of cases) {
      const { container, unmount } = render(
        <SelectableGrid
          emptyText="Please select a load type"
          items={items}
          layout={testCase.layout}
          orientation={testCase.orientation}
          value={null}
        />
      )
      const root = container.firstElementChild
      const grid = root?.firstElementChild
      const description = root?.lastElementChild

      expect(root?.getAttribute('class')).toContain(testCase.rootClassName)
      expect(grid?.getAttribute('class')).toContain(testCase.gridClassName)
      expect(description?.getAttribute('class')).toContain(testCase.descriptionClassName)

      unmount()
    }
  })
})
