import { fireEvent, render, screen } from '@testing-library/react'

import {
  StackedPanel,
  StackedPanelContent,
  StackedPanelItem,
  StackedPanelTrigger
} from './StackedPanel'

describe('StackedPanel', () => {
  it('derives slide variables from the active item', () => {
    render(
      <StackedPanel data-testid="stacked-panel" value="metrics">
        <StackedPanelItem value="metrics">
          <StackedPanelTrigger>metrics</StackedPanelTrigger>
          <StackedPanelContent>Metrics content</StackedPanelContent>
        </StackedPanelItem>
        <StackedPanelItem value="notes">
          <StackedPanelTrigger>notes</StackedPanelTrigger>
          <StackedPanelContent>Notes content</StackedPanelContent>
        </StackedPanelItem>
      </StackedPanel>
    )

    const stackedPanel = screen.getByTestId('stacked-panel')
    const metricsTab = screen.getByRole('tab', { name: 'metrics' })
    const notesTab = screen.getByRole('tab', { name: 'notes' })
    const panels = stackedPanel.querySelectorAll('[role="tabpanel"]')

    expect(stackedPanel.style.getPropertyValue('--stacked-panel-item-count')).toBe('2')
    expect(stackedPanel.style.getPropertyValue('--stacked-panel-active-index')).toBe('0')
    expect(metricsTab.getAttribute('aria-selected')).toBe('true')
    expect(notesTab.getAttribute('aria-selected')).toBe('false')
    expect(panels[0]?.hasAttribute('aria-hidden')).toBe(false)
    expect(panels[1]?.getAttribute('aria-hidden')).toBe('true')
    expect(panels[1]?.hasAttribute('inert')).toBe(true)
  })

  it('slides to the selected item when uncontrolled', () => {
    render(
      <StackedPanel data-testid="stacked-panel" defaultValue="metrics">
        <StackedPanelItem value="metrics">
          <StackedPanelTrigger>metrics</StackedPanelTrigger>
          <StackedPanelContent>Metrics content</StackedPanelContent>
        </StackedPanelItem>
        <StackedPanelItem value="notes">
          <StackedPanelTrigger>notes</StackedPanelTrigger>
          <StackedPanelContent>Notes content</StackedPanelContent>
        </StackedPanelItem>
      </StackedPanel>
    )

    fireEvent.click(screen.getByRole('tab', { name: 'notes' }))

    const stackedPanel = screen.getByTestId('stacked-panel')

    expect(stackedPanel.style.getPropertyValue('--stacked-panel-active-index')).toBe('1')
    expect(screen.getByRole('tab', { name: 'notes' }).getAttribute('aria-selected')).toBe('true')
  })

  it('places empty content as the first sliding panel', () => {
    render(
      <StackedPanel data-testid="stacked-panel" empty={<div>Choose a panel</div>} value="metrics">
        <StackedPanelItem value="metrics">
          <StackedPanelTrigger>metrics</StackedPanelTrigger>
          <StackedPanelContent>Metrics content</StackedPanelContent>
        </StackedPanelItem>
        <StackedPanelItem value="notes">
          <StackedPanelTrigger>notes</StackedPanelTrigger>
          <StackedPanelContent>Notes content</StackedPanelContent>
        </StackedPanelItem>
      </StackedPanel>
    )

    const stackedPanel = screen.getByTestId('stacked-panel')
    const emptyPanel = stackedPanel.querySelector('[data-slot="stacked-panel-empty"]')

    expect(stackedPanel.style.getPropertyValue('--stacked-panel-item-count')).toBe('3')
    expect(stackedPanel.style.getPropertyValue('--stacked-panel-active-index')).toBe('1')
    expect(screen.getByText('Choose a panel')).not.toBeNull()
    expect(emptyPanel?.getAttribute('aria-hidden')).toBe('true')
    expect(emptyPanel?.hasAttribute('inert')).toBe(true)
    expect(screen.getByRole('tab', { name: 'metrics' }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tab', { name: 'notes' }).getAttribute('aria-selected')).toBe('false')
  })

  it('renders empty content when value is null without requiring collapsible', () => {
    render(
      <StackedPanel data-testid="stacked-panel" empty={<div>Choose a panel</div>} value={null}>
        <StackedPanelItem value="metrics">
          <StackedPanelTrigger>metrics</StackedPanelTrigger>
          <StackedPanelContent>Metrics content</StackedPanelContent>
        </StackedPanelItem>
        <StackedPanelItem value="notes">
          <StackedPanelTrigger>notes</StackedPanelTrigger>
          <StackedPanelContent>Notes content</StackedPanelContent>
        </StackedPanelItem>
      </StackedPanel>
    )

    const stackedPanel = screen.getByTestId('stacked-panel')
    const emptyPanel = stackedPanel.querySelector('[data-slot="stacked-panel-empty"]')

    expect(screen.getByText('Choose a panel')).not.toBeNull()
    expect(stackedPanel.style.getPropertyValue('--stacked-panel-active-index')).toBe('0')
    expect(emptyPanel?.hasAttribute('aria-hidden')).toBe(false)
    expect(emptyPanel?.hasAttribute('inert')).toBe(false)
    expect(screen.getByRole('tab', { name: 'metrics' }).getAttribute('aria-selected')).toBe('false')
    expect(screen.getByRole('tab', { name: 'notes' }).getAttribute('aria-selected')).toBe('false')
  })

  it('collapses the active item when collapsible', () => {
    render(
      <StackedPanel
        collapsible
        data-testid="stacked-panel"
        defaultValue="metrics"
        empty={<div>Choose a panel</div>}
      >
        <StackedPanelItem value="metrics">
          <StackedPanelTrigger>metrics</StackedPanelTrigger>
          <StackedPanelContent>Metrics content</StackedPanelContent>
        </StackedPanelItem>
        <StackedPanelItem value="notes">
          <StackedPanelTrigger>notes</StackedPanelTrigger>
          <StackedPanelContent>Notes content</StackedPanelContent>
        </StackedPanelItem>
      </StackedPanel>
    )

    fireEvent.click(screen.getByRole('tab', { name: 'metrics' }))

    const stackedPanel = screen.getByTestId('stacked-panel')

    expect(screen.getByText('Choose a panel')).not.toBeNull()
    expect(stackedPanel.style.getPropertyValue('--stacked-panel-active-index')).toBe('0')
    expect(screen.getByRole('tab', { name: 'metrics' }).getAttribute('aria-selected')).toBe('false')
  })

  it('renders the horizontal-panel-style trigger overlay', () => {
    render(
      <StackedPanel defaultValue="metrics">
        <StackedPanelItem value="metrics">
          <StackedPanelTrigger>metrics</StackedPanelTrigger>
          <StackedPanelContent>Metrics content</StackedPanelContent>
        </StackedPanelItem>
      </StackedPanel>
    )

    const trigger = screen.getByRole('tab', { name: 'metrics' })
    const overlay = trigger.querySelector('[data-slot="stacked-panel-trigger-overlay"]')
    const overlayLabel = trigger.querySelector('[data-slot="stacked-panel-trigger-label"]')

    expect(trigger.getAttribute('class') ?? '').toContain('font-heading')
    expect(trigger.getAttribute('class') ?? '').toContain('px-5')
    expect(overlay?.getAttribute('class') ?? '').toContain('[clip-path:inset(0_100%_0_0)]')
    expect(overlay?.getAttribute('class') ?? '').toContain(
      'group-data-active:[clip-path:inset(0_0_0_0)]'
    )
    expect(overlayLabel?.getAttribute('class') ?? '').toContain('px-5')
  })
})
