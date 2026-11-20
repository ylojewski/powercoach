import { mergeProps } from '@base-ui/react/merge-props'
import { Tabs as BaseUiTabs } from '@base-ui/react/tabs'
import { useContext, type ReactElement } from 'react'

import { TabsRenderedTabSurface } from './TabsRenderedTabSurface'
import { RevealAnimation, type RevealAnimationProps } from '../../../animations'
import { buttonChromeHeadingSize, buttonChromeVariants } from '../../Button'
import { Heading } from '../../Heading'
import { tabsListContext } from '../constants/tabsListContext'

export type TabsTabValue = BaseUiTabs.Tab.Value

export type TabsTabActivationDirection = BaseUiTabs.Tab.ActivationDirection

export type TabsTabPosition = BaseUiTabs.Tab.Position

export type TabsTabSize = BaseUiTabs.Tab.Size

export type TabsTabMetadata = BaseUiTabs.Tab.Metadata

export type TabsTabState = BaseUiTabs.Tab.State

export type TabsTabRevealAnimationProps = Omit<
  RevealAnimationProps,
  'children' | 'render' | 'reveal'
>

export type TabsTabProps = BaseUiTabs.Tab.Props & {
  revealAnimation?: TabsTabRevealAnimationProps
}

export function TabsTab({
  children,
  className,
  render,
  revealAnimation,
  ...props
}: TabsTabProps): ReactElement {
  const listState = useContext(tabsListContext)

  if (listState.firstTabValue === undefined) {
    listState.firstTabValue = props.value
  }

  return (
    <BaseUiTabs.Tab
      {...props}
      className={(state) =>
        mergeProps<'button'>(
          {
            className: mergeProps<'button'>(
              {
                className: buttonChromeVariants({ size: 'lg', variant: 'default' })
              },
              {
                // prettier-ignore
                className: `
                  [border-width:var(--tabs-border-width)]
                  data-[orientation=horizontal]:[[data-reveal-root]~[data-reveal-root]_&]:border-s-0
                  data-[orientation=vertical]:[[data-reveal-root]~[data-reveal-root]_&]:border-t-0
                `
              }
            ).className
          },
          {
            className: typeof className === 'function' ? className(state) : className
          }
        ).className
      }
      render={(tabProps, state) => (
        <RevealAnimation
          {...revealAnimation}
          render={<TabsRenderedTabSurface {...tabProps} render={render} state={state} />}
          reveal={state.active ? true : state.disabled ? false : undefined}
        >
          <Heading
            className={
              state.disabled ? 'text-muted-foreground transition-colors' : 'transition-colors'
            }
            size={buttonChromeHeadingSize('lg')}
          >
            {children}
          </Heading>
        </RevealAnimation>
      )}
    />
  )
}

// Declaration merging exposes the documented Tabs.Tab.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TabsTab {
  export type Value = TabsTabValue
  export type ActivationDirection = TabsTabActivationDirection
  export type Position = TabsTabPosition
  export type Size = TabsTabSize
  export type Metadata = TabsTabMetadata
  export type State = TabsTabState
  export type Props = TabsTabProps
}
