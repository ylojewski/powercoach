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
    expect(horizontalPanel.style.getPropertyValue('--horizontal-panel-collapsed-width')).toBe(
      'calc(var(--horizontal-panel-item-count) * (var(--horizontal-panel-trigger-width)))'
    )
  })

  it('renders fused trigger border layers without layout borders', () => {
    render(
      <HorizontalPanel data-testid="horizontal-panel" value={['metrics']}>
        <HorizontalPanelItem value="metrics">
          <HorizontalPanelTrigger>metrics</HorizontalPanelTrigger>
          <HorizontalPanelContent>Metrics content</HorizontalPanelContent>
        </HorizontalPanelItem>
      </HorizontalPanel>
    )

    const trigger = screen.getByRole('button', { name: 'metrics' })
    const triggerClassName = trigger.getAttribute('class') ?? ''

    expect(triggerClassName).toContain('before:bg-border')
    expect(triggerClassName).toContain('before:w-px')
    expect(triggerClassName).toContain('in-[[data-slot=accordion-item]:last-child]:after:bg-border')
    expect(triggerClassName).toContain('in-[[data-slot=accordion-item]:last-child]:after:w-px')
    expect(triggerClassName).not.toContain('border-l')
    expect(triggerClassName).not.toContain('border-r')
  })

  it('renders a left-to-right overlay for hover, focus-visible, and active states', () => {
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
    const labelClassName = label?.getAttribute('class') ?? ''
    const overlayLabelClassName = label?.firstElementChild?.getAttribute('class') ?? ''
    const baseLabelClassName = baseLabel?.getAttribute('class') ?? ''

    expect(trigger.getAttribute('data-panel-open')).toBe('')
    expect(trigger.getAttribute('class') ?? '').toContain('bg-background')
    expect(trigger.getAttribute('class') ?? '').toContain('outline-none')
    expect(trigger.getAttribute('class') ?? '').toContain('focus-visible:outline-none')
    expect(overlay?.getAttribute('aria-hidden')).toBe('true')
    expect(overlayClassName).toContain('overflow-hidden')
    expect(overlayClassName).toContain('-inset-px')
    expect(overlayClassName).toContain('bg-foreground')
    expect(overlayClassName).toContain('text-background')
    expect(overlayClassName).toContain('[clip-path:inset(0_100%_0_0)]')
    expect(overlayClassName).toContain('group-hover:[clip-path:inset(0_0_0_0)]')
    expect(overlayClassName).toContain('group-focus-visible:[clip-path:inset(0_0_0_0)]')
    expect(overlayClassName).toContain('group-data-[panel-open]:[clip-path:inset(0_0_0_0)]')
    expect(fill).toBeNull()
    expect(labelClassName).toContain('overflow-hidden')
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
    expect(baseLabelClassName).toContain('z-10')
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
