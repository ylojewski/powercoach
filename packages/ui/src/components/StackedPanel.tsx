import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { type BaseUIEvent } from '@base-ui/react/types'
import React from 'react'

import { cn } from '@/src/coss/lib/utils'

interface StackedPanelStyle extends React.CSSProperties {
  '--stacked-panel-active-index'?: string
  '--stacked-panel-item-count'?: string
}

export interface StackedPanelProps<Value = unknown>
  extends Omit<
    TabsPrimitive.Root.Props,
    'children' | 'defaultValue' | 'onValueChange' | 'orientation' | 'value'
  > {
  children: React.ReactNode
  collapsible?: boolean
  defaultValue?: Value | null
  empty?: React.ReactNode
  listClassName?: string
  onValueChange?: (value: Value | null) => void
  trackClassName?: string
  value?: Value | null
  viewportClassName?: string
}

export interface StackedPanelItemProps<Value = unknown> {
  children: React.ReactNode
  disabled?: boolean
  value: Value
}

export interface StackedPanelTriggerProps
  extends Omit<TabsPrimitive.Tab.Props, 'children' | 'disabled' | 'value'> {
  children: React.ReactNode
}

export type StackedPanelContentProps = React.ComponentPropsWithoutRef<'div'>

export function StackedPanel<Value = unknown>({
  children,
  className,
  collapsible = false,
  defaultValue,
  empty,
  listClassName,
  onValueChange,
  style,
  trackClassName,
  value: valueProp,
  viewportClassName,
  ...props
}: StackedPanelProps<Value>): React.ReactElement {
  const idPrefix = React.useId()
  const items = React.useMemo(() => getStackedPanelItems<Value>(children), [children])
  const hasEmpty = empty !== undefined && empty !== null
  const firstItemValue = items[0]?.value
  const fallbackValue = firstItemValue ?? null
  const [uncontrolledValue, setUncontrolledValue] = React.useState<Value | null>(
    defaultValue !== undefined ? defaultValue : fallbackValue
  )
  const requestedValue = valueProp !== undefined ? valueProp : uncontrolledValue
  const requestedIndex =
    requestedValue === null ? -1 : items.findIndex((item) => item.value === requestedValue)
  const activeItemIndex = (() => {
    if (requestedIndex >= 0) {
      return requestedIndex
    }

    if (requestedValue === null && hasEmpty) {
      return -1
    }

    return items.length > 0 ? 0 : -1
  })()
  const activeValue = activeItemIndex >= 0 ? (items[activeItemIndex]?.value ?? null) : null
  const activePanelIndex = activeItemIndex >= 0 ? activeItemIndex + (hasEmpty ? 1 : 0) : 0
  const panelCount = items.length + (hasEmpty ? 1 : 0)

  React.useEffect(() => {
    if (valueProp !== undefined) {
      return
    }

    const hasUncontrolledValue =
      (uncontrolledValue === null && hasEmpty) ||
      items.some((item) => item.value === uncontrolledValue)

    if (!hasUncontrolledValue) {
      setUncontrolledValue(fallbackValue)
    }
  }, [fallbackValue, hasEmpty, items, uncontrolledValue, valueProp])

  const setPanelValue = React.useCallback(
    (nextValue: Value | null): void => {
      onValueChange?.(nextValue)

      if (valueProp === undefined) {
        setUncontrolledValue(nextValue)
      }
    },
    [onValueChange, valueProp]
  )

  const onTabsValueChange = React.useCallback(
    (nextValue: TabsPrimitive.Tab.Props['value']): void => {
      if (nextValue !== activeValue) {
        setPanelValue(nextValue as Value | null)
      }
    },
    [activeValue, setPanelValue]
  )

  const stackedPanelStyle: StackedPanelStyle = {
    ...style,
    '--stacked-panel-active-index': String(activePanelIndex),
    '--stacked-panel-item-count': String(panelCount)
  }

  return (
    <TabsPrimitive.Root
      className={cn(
        '@container grid h-full min-h-0 min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] overflow-hidden',
        className
      )}
      data-slot="stacked-panel"
      onValueChange={onTabsValueChange}
      orientation="vertical"
      style={stackedPanelStyle}
      value={activeValue}
      {...props}
    >
      <TabsPrimitive.List
        className={cn('col-start-1 row-start-1 flex min-h-0 min-w-0 flex-col', listClassName)}
        data-slot="stacked-panel-list"
      >
        {items.map((item, index) => {
          const {
            children: triggerChildren,
            className: triggerClassName,
            onClick,
            ...triggerProps
          } = item.trigger?.props ?? {}
          const active = activeValue !== null && item.value === activeValue
          const triggerId = getStackedPanelTriggerId(idPrefix, index)
          const contentId = getStackedPanelContentId(idPrefix, index)
          const onTriggerClick = (
            event: BaseUIEvent<React.MouseEvent<HTMLButtonElement>>
          ): void => {
            onClick?.(event)

            if (!collapsible || !active || event.defaultPrevented) {
              return
            }

            event.preventBaseUIHandler()
            setPanelValue(null)
          }

          return (
            <TabsPrimitive.Tab
              aria-controls={contentId}
              className={cn(
                'group relative isolate flex min-h-0 w-full flex-1 cursor-pointer items-end justify-start overflow-hidden bg-background px-5 py-2 text-left font-heading outline-none before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-0 before:h-px before:bg-border last:after:pointer-events-none last:after:absolute last:after:inset-x-0 last:after:bottom-0 last:after:z-0 last:after:h-px last:after:bg-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:pointer-events-none data-disabled:opacity-64',
                triggerClassName
              )}
              data-slot="stacked-panel-trigger"
              disabled={item.disabled}
              id={triggerId}
              key={triggerId}
              onClick={onTriggerClick}
              value={item.value as TabsPrimitive.Tab.Props['value']}
              {...triggerProps}
            >
              <span className="relative z-10 text-sm text-nowrap">{triggerChildren}</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px z-20 overflow-hidden bg-foreground text-background transition-[clip-path] duration-300 ease-in-out [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] group-data-active:[clip-path:inset(0_0_0_0)]"
                data-slot="stacked-panel-trigger-overlay"
              >
                <span
                  className="absolute inset-0 flex items-end overflow-hidden px-5 py-2"
                  data-slot="stacked-panel-trigger-label"
                >
                  <span className="font-heading text-nowrap">{triggerChildren}</span>
                </span>
              </span>
            </TabsPrimitive.Tab>
          )
        })}
      </TabsPrimitive.List>
      <div
        className={cn('col-start-2 row-start-1 min-h-0 min-w-0 overflow-hidden', viewportClassName)}
        data-slot="stacked-panel-viewport"
      >
        <div
          className={cn(
            'h-full min-h-0 min-w-0 transform-[translateY(calc(var(--stacked-panel-active-index)*-100%))] transition-transform duration-300 ease-in-out will-change-transform',
            trackClassName
          )}
          data-slot="stacked-panel-track"
        >
          {hasEmpty && (
            <div
              aria-hidden={activeValue === null ? undefined : true}
              className="h-full min-h-full min-w-0 overflow-auto outline-none"
              data-active={activeValue === null ? '' : undefined}
              data-slot="stacked-panel-empty"
              inert={activeValue !== null}
              role="tabpanel"
              tabIndex={activeValue === null ? 0 : -1}
            >
              {empty}
            </div>
          )}
          {items.map((item, index) => {
            const {
              children: contentChildren,
              className: contentClassName,
              ...contentProps
            } = item.content?.props ?? {}
            const active = activeValue !== null && item.value === activeValue
            const triggerId = getStackedPanelTriggerId(idPrefix, index)
            const contentId = getStackedPanelContentId(idPrefix, index)

            return (
              <div
                {...contentProps}
                aria-hidden={active ? undefined : true}
                aria-labelledby={triggerId}
                className={cn(
                  'h-full min-h-full min-w-0 overflow-auto outline-none',
                  contentClassName
                )}
                data-active={active ? '' : undefined}
                data-slot="stacked-panel-content"
                id={contentId}
                inert={!active}
                key={contentId}
                role="tabpanel"
                tabIndex={active ? 0 : -1}
              >
                {contentChildren}
              </div>
            )
          })}
        </div>
      </div>
    </TabsPrimitive.Root>
  )
}

export function StackedPanelItem<Value = unknown>(
  _props: StackedPanelItemProps<Value>
): React.ReactElement | null {
  return null
}

export function StackedPanelTrigger(_props: StackedPanelTriggerProps): React.ReactElement | null {
  return null
}

export function StackedPanelContent(_props: StackedPanelContentProps): React.ReactElement | null {
  return null
}

function getStackedPanelItems<Value = unknown>(
  children: React.ReactNode
): {
  content?: React.ReactElement<StackedPanelContentProps>
  disabled?: boolean
  trigger?: React.ReactElement<StackedPanelTriggerProps>
  value: Value
}[] {
  return React.Children.toArray(children)
    .filter(isStackedPanelItemElement<Value>)
    .map((child) => {
      const itemChildren = React.Children.toArray(child.props.children)
      const trigger = itemChildren.find(isStackedPanelTriggerElement)
      const content = itemChildren.find(isStackedPanelContentElement)

      return {
        content,
        disabled: child.props.disabled,
        trigger,
        value: child.props.value
      }
    })
}

function isStackedPanelItemElement<Value = unknown>(
  child: React.ReactNode
): child is React.ReactElement<StackedPanelItemProps<Value>> {
  return React.isValidElement(child) && child.type === StackedPanelItem
}

function isStackedPanelTriggerElement(
  child: React.ReactNode
): child is React.ReactElement<StackedPanelTriggerProps> {
  return React.isValidElement(child) && child.type === StackedPanelTrigger
}

function isStackedPanelContentElement(
  child: React.ReactNode
): child is React.ReactElement<StackedPanelContentProps> {
  return React.isValidElement(child) && child.type === StackedPanelContent
}

function getStackedPanelTriggerId(idPrefix: string, index: number): string {
  return `${idPrefix}-stacked-panel-trigger-${index}`
}

function getStackedPanelContentId(idPrefix: string, index: number): string {
  return `${idPrefix}-stacked-panel-content-${index}`
}
