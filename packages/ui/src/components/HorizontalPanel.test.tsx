import { fireEvent, render, screen } from '@testing-library/react'

import {
  HorizontalPanel,
  HorizontalPanelContent,
  HorizontalPanelItem,
  HorizontalPanelTrigger
} from './HorizontalPanel'

describe('HorizontalPanel', () => {
  it('derives css variables from the rendered panel count', () => {
    render(
      <HorizontalPanel data-testid="horizontal-panel">
        <HorizontalPanelItem value="metrics">
          <HorizontalPanelTrigger>metrics</HorizontalPanelTrigger>
          <HorizontalPanelContent>Metrics content</HorizontalPanelContent>
        </HorizontalPanelItem>
        <HorizontalPanelItem value="notes">
          <HorizontalPanelTrigger>notes</HorizontalPanelTrigger>
          <HorizontalPanelContent>Notes content</HorizontalPanelContent>
        </HorizontalPanelItem>
      </HorizontalPanel>
    )

    const horizontalPanel = screen.getByTestId('horizontal-panel')

    expect(horizontalPanel.style.getPropertyValue('--horizontal-panel-item-count')).toBe('2')
    expect(horizontalPanel.style.getPropertyValue('--horizontal-panel-trigger-width')).toBe('40px')
    expect(horizontalPanel.style.getPropertyValue('--horizontal-panel-trigger-label-size')).toBe(
      '1rem'
    )
    expect(
      horizontalPanel.style.getPropertyValue('--horizontal-panel-trigger-label-hover-size')
    ).toBe('1.125rem')
    expect(horizontalPanel.style.getPropertyValue('--horizontal-panel-item-border-width')).toBe(
      '1px'
    )
    expect(horizontalPanel.style.getPropertyValue('--horizontal-panel-collapsed-width')).toBe(
      'calc(var(--horizontal-panel-item-count) * (var(--horizontal-panel-trigger-width) + var(--horizontal-panel-item-border-width)))'
    )
  })

  it('reuses the border width variable for panel borders', () => {
    render(
      <HorizontalPanel data-testid="horizontal-panel" value={['metrics']}>
        <HorizontalPanelItem value="metrics">
          <HorizontalPanelTrigger>metrics</HorizontalPanelTrigger>
          <HorizontalPanelContent>Metrics content</HorizontalPanelContent>
        </HorizontalPanelItem>
      </HorizontalPanel>
    )

    const item = screen
      .getByRole('button', { name: 'metrics' })
      .closest('[data-slot="accordion-item"]')
    const content = item?.querySelector('[data-slot="accordion-panel"] > div')
    const itemClassName = item?.getAttribute('class') ?? ''
    const contentClassName = content?.getAttribute('class') ?? ''

    expect(itemClassName).toContain('[border-left-width:var(--horizontal-panel-item-border-width)]')
    expect(contentClassName).toContain('bg-background')
    expect(contentClassName).toContain(
      '[border-left-width:var(--horizontal-panel-item-border-width)]'
    )
  })

  it('renders a reverse overlay for hover, focus-visible, and active states', () => {
    render(
      <HorizontalPanel data-testid="horizontal-panel" value={['metrics']}>
        <HorizontalPanelItem value="metrics">
          <HorizontalPanelTrigger>metrics</HorizontalPanelTrigger>
          <HorizontalPanelContent>Metrics content</HorizontalPanelContent>
        </HorizontalPanelItem>
      </HorizontalPanel>
    )

    const trigger = screen.getByRole('button', { name: 'metrics' })
    const overlay = trigger.querySelector('[data-slot="horizontal-panel-trigger-overlay"]')
    const fill = trigger.querySelector('[data-slot="horizontal-panel-trigger-fill"]')
    const label = trigger.querySelector('[data-slot="horizontal-panel-trigger-label"]')
    const baseLabel = trigger.querySelector('span:not([aria-hidden="true"])')
    const overlayClassName = overlay?.getAttribute('class') ?? ''
    const fillClassName = fill?.getAttribute('class') ?? ''
    const labelClassName = label?.getAttribute('class') ?? ''
    const overlayLabelClassName = label?.firstElementChild?.getAttribute('class') ?? ''
    const baseLabelClassName = baseLabel?.getAttribute('class') ?? ''

    expect(trigger.getAttribute('data-panel-open')).toBe('')
    expect(trigger.getAttribute('class') ?? '').toContain('bg-background')
    expect(trigger.getAttribute('class') ?? '').toContain('outline-none')
    expect(trigger.getAttribute('class') ?? '').toContain('focus-visible:outline-none')
    expect(overlay?.getAttribute('aria-hidden')).toBe('true')
    expect(overlayClassName).toContain('overflow-hidden')
    expect(overlayClassName).toContain('inset-0')
    expect(overlayClassName).toContain('[clip-path:inset(0_0_0_100%)]')
    expect(overlayClassName).toContain('group-hover:[clip-path:inset(0_0_0_0)]')
    expect(overlayClassName).toContain('group-focus-visible:[clip-path:inset(0_0_0_0)]')
    expect(overlayClassName).toContain('group-data-[panel-open]:[clip-path:inset(0_0_0_0)]')
    expect(fillClassName).toContain('bg-foreground')
    expect(fillClassName).toContain('translate-x-full')
    expect(fillClassName).toContain('group-hover:translate-x-0')
    expect(fillClassName).toContain('group-focus-visible:translate-x-0')
    expect(fillClassName).toContain('group-data-[panel-open]:translate-x-0')
    expect(labelClassName).toContain('text-background')
    expect(overlayLabelClassName).toContain(
      'top-[calc(var(--horizontal-panel-trigger-width)/2-var(--horizontal-panel-trigger-label-hover-size))]'
    )
    expect(overlayLabelClassName).toContain('left-1/2')
    expect(overlayLabelClassName).toContain('font-heading')
    expect(overlayLabelClassName).toContain('origin-[0]')
    expect(overlayLabelClassName).toContain('rotate-90')
    expect(overlayLabelClassName).toContain('text-xl')
    expect(baseLabelClassName).toContain(
      'top-[calc(var(--horizontal-panel-trigger-width)/2-var(--horizontal-panel-trigger-label-size))]'
    )
    expect(baseLabelClassName).toContain('left-1/2')
    expect(baseLabelClassName).toContain('origin-[0]')
    expect(baseLabelClassName).toContain('rotate-90')
    expect(baseLabelClassName).not.toContain('text-xl')
  })

  it('collapses the active panel by default when its trigger is clicked', () => {
    render(
      <HorizontalPanel defaultValue={['metrics']}>
        <HorizontalPanelItem value="metrics">
          <HorizontalPanelTrigger>metrics</HorizontalPanelTrigger>
          <HorizontalPanelContent>Metrics content</HorizontalPanelContent>
        </HorizontalPanelItem>
      </HorizontalPanel>
    )

    const trigger = screen.getByRole('button', { name: 'metrics' })

    fireEvent.click(trigger)

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('keeps the active panel open when collapsible is false', () => {
    render(
      <HorizontalPanel collapsible={false} defaultValue={['metrics']}>
        <HorizontalPanelItem value="metrics">
          <HorizontalPanelTrigger>metrics</HorizontalPanelTrigger>
          <HorizontalPanelContent>Metrics content</HorizontalPanelContent>
        </HorizontalPanelItem>
      </HorizontalPanel>
    )

    const trigger = screen.getByRole('button', { name: 'metrics' })

    fireEvent.click(trigger)

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })
})
