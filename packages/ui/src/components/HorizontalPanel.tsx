import { Accordion } from '@base-ui/react/accordion'
import { type BaseUIEvent } from '@base-ui/react/types'
import React from 'react'

import { cn } from '@/src/coss/lib/utils'

interface HorizontalPanelStyle extends React.CSSProperties {
  '--horizontal-panel-collapsed-width'?: string
  '--horizontal-panel-item-border-width'?: string
  '--horizontal-panel-item-count'?: string
  '--horizontal-panel-trigger-width'?: string
}

export interface HorizontalPanelProps<Value = unknown> extends Accordion.Root.Props<Value> {
  collapsible?: boolean
}

const HorizontalPanelContext = React.createContext<{
  collapsible: boolean
}>({
  collapsible: true
})

export function HorizontalPanel<Value = unknown>({
  children,
  className,
  collapsible = true,
  style,
  ...props
}: HorizontalPanelProps<Value>): React.ReactElement {
  const panelCount = React.Children.toArray(children).filter(React.isValidElement).length

  const horizontalPanelStyle: HorizontalPanelStyle = {
    '--horizontal-panel-collapsed-width':
      'calc(var(--horizontal-panel-item-count) * (var(--horizontal-panel-trigger-width) + var(--horizontal-panel-item-border-width)))',
    '--horizontal-panel-item-border-width': '1px',
    '--horizontal-panel-item-count': String(panelCount),
    '--horizontal-panel-trigger-width': '40px',
    ...style
  }
  const contextValue = React.useMemo(() => ({ collapsible }), [collapsible])

  return (
    <HorizontalPanelContext.Provider value={contextValue}>
      <Accordion.Root
        className={cn('absolute inset-0 @container flex justify-end', className)}
        data-slot="accordion"
        style={horizontalPanelStyle}
        orientation="horizontal"
        {...props}
      >
        {children}
      </Accordion.Root>
    </HorizontalPanelContext.Provider>
  )
}

export function HorizontalPanelItem({
  className,
  ...props
}: Accordion.Item.Props): React.ReactElement {
  return (
    <Accordion.Item
      className={cn(
        'flex h-full border-l border-gray-200 [border-left-width:var(--horizontal-panel-item-border-width)] dark:border-gray-700',
        className
      )}
      data-slot="accordion-item"
      {...props}
    />
  )
}

export function HorizontalPanelTrigger({
  className,
  children,
  onClick,
  ...props
}: Accordion.Trigger.Props): React.ReactElement {
  const { collapsible } = React.useContext(HorizontalPanelContext)
  const handleClick = React.useCallback(
    (event: BaseUIEvent<React.MouseEvent<HTMLButtonElement>>): void => {
      if (!collapsible && event.currentTarget.getAttribute('aria-expanded') === 'true') {
        event.preventBaseUIHandler()
      }

      onClick?.(event)
    },
    [collapsible, onClick]
  )

  return (
    <Accordion.Header>
      <Accordion.Trigger
        className={cn(
          'group relative flex h-full w-[var(--horizontal-panel-trigger-width)] justify-center overflow-hidden bg-background font-heading outline-none focus:outline-none focus-visible:outline-none',
          className
        )}
        data-slot="accordion-trigger"
        onClick={handleClick}
        {...props}
      >
        <span className="absolute top-[calc(var(--horizontal-panel-trigger-width)/2-1rem)] left-1/2 rotate-90 origin-[0]">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden transition-[clip-path] duration-300 ease-in-out [clip-path:inset(0_0_0_100%)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] group-data-[panel-open]:[clip-path:inset(0_0_0_0)]"
          data-slot="horizontal-panel-trigger-overlay"
        >
          <span
            className="absolute inset-0 translate-x-full bg-foreground transition-transform duration-300 ease-in-out group-hover:translate-x-0 group-focus-visible:translate-x-0 group-data-[panel-open]:translate-x-0"
            data-slot="horizontal-panel-trigger-fill"
          />
          <span
            className="absolute inset-0 overflow-hidden text-background"
            data-slot="horizontal-panel-trigger-label"
          >
            <span className="absolute top-[calc(var(--horizontal-panel-trigger-width)/2-1rem)] left-1/2 rotate-90 origin-[0] font-heading text-xl">
              {children}
            </span>
          </span>
        </span>
      </Accordion.Trigger>
    </Accordion.Header>
  )
}

export function HorizontalPanelContent({
  className,
  children,
  ...props
}: Accordion.Panel.Props): React.ReactElement {
  return (
    <Accordion.Panel
      className={cn(
        'overflow-hidden',
        'w-[var(--accordion-panel-width)] data-[starting-style]:w-0  data-[ending-style]:w-0',
        'transition-[width] duration-300 ease-in-out',
        className
      )}
      data-slot="accordion-panel"
      {...props}
    >
      <div className="w-[calc(100cqw-var(--horizontal-panel-collapsed-width))] h-full border-l border-gray-200 bg-background [border-left-width:var(--horizontal-panel-item-border-width)] dark:border-gray-700">
        {children}
      </div>
    </Accordion.Panel>
  )
}
