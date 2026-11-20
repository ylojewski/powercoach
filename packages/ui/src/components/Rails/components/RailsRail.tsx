import { Accordion } from '@base-ui/react/accordion'
import { mergeProps } from '@base-ui/react/merge-props'
import { useContext, type CSSProperties, type MouseEvent, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { RailsRenderedRailSurface } from './RailsRenderedRailSurface'
import { RevealAnimation } from '../../../animations'
import { buttonChromeHeadingSize, buttonChromeVariants } from '../../Button'
import { Heading } from '../../Heading'
import { railsOrientationContext } from '../constants/railsOrientationContext'
import { normalizeRailsState, type RailsState } from '../utils/normalizeRailsState'
import { renderRailsElement } from '../utils/renderRailsElement'
import { resolveRailsProp } from '../utils/resolveRailsProp'

export type RailsRailState = RailsState<Accordion.Trigger.State>

export interface RailsRailProps
  extends Omit<Accordion.Trigger.Props, 'className' | 'render' | 'style'> {
  className?: string | ((state: RailsRailState) => string | undefined)
  render?: ReactElement | ((props: Record<string, unknown>, state: RailsRailState) => ReactElement)
  style?: CSSProperties | ((state: RailsRailState) => CSSProperties | undefined)
}

export function RailsRail({
  children,
  className,
  render,
  style,
  ...props
}: RailsRailProps): ReactElement {
  const orientation = useContext(railsOrientationContext)
  const railChildren =
    // prettier-ignore
    <span
      className={
        orientation === 'vertical'
          ? `
              absolute top-5 left-1/2 flex shrink-0
              origin-[left_center] [transform:translateY(-50%)_rotate(90deg)]
              text-left whitespace-nowrap text-inherit
            `
          : `flex min-w-0 shrink-0 text-left whitespace-nowrap text-inherit`
      }
    >
      <Heading className="text-inherit" size={buttonChromeHeadingSize('lg')}>
        {children}
      </Heading>
    </span>

  return (
    <Accordion.Trigger
      {...props}
      className={(state) =>
        twMerge(
          mergeProps<'button'>(
            {
              className: resolveRailsProp(className, normalizeRailsState(state, orientation))
            },
            {
              className: state.disabled
                ? 'border-muted-foreground text-muted-foreground'
                : undefined
            },
            {
              // prettier-ignore
              className:
                orientation === 'vertical'
                  ? `
                      group/rails-rail box-border flex h-full w-10 shrink-0 px-0 py-0
                      [writing-mode:horizontal-tb]
                      [border-width:var(--rails-border-width)]
                      [&_[data-reveal-source]]:relative [&_[data-reveal-source]]:flex
                      [&_[data-reveal-source]]:size-full
                      [&_[data-reveal-source]]:overflow-visible
                      [&[data-reveal-overlay-surface]_[data-reveal-copy]]:relative
                      [&[data-reveal-overlay-surface]_[data-reveal-copy]]:flex
                      [&[data-reveal-overlay-surface]_[data-reveal-copy]]:size-full
                      [&[data-reveal-overlay-surface]_[data-reveal-copy]]:overflow-visible
                      [&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:absolute
                      [&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:top-5
                      [&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:left-1/2
                      [&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:size-0
                      [&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:overflow-visible
                      [&[data-reveal-overlay-surface]_[data-reveal-copy-scale]>*]:top-0
                    `
                  : `
                      group/rails-rail box-border flex h-10 w-full shrink-0 items-center justify-start px-3 py-0
                      [writing-mode:horizontal-tb]
                      [border-width:var(--rails-border-width)]
                      [&_[data-reveal-source]]:relative [&_[data-reveal-source]]:flex
                      [&_[data-reveal-source]]:size-full [&_[data-reveal-source]]:items-center
                      [&_[data-reveal-source]]:overflow-visible
                      [&[data-reveal-overlay-surface]_[data-reveal-copy]]:relative
                      [&[data-reveal-overlay-surface]_[data-reveal-copy]]:flex
                      [&[data-reveal-overlay-surface]_[data-reveal-copy]]:size-full
                      [&[data-reveal-overlay-surface]_[data-reveal-copy]]:items-center
                      [&[data-reveal-overlay-surface]_[data-reveal-copy]]:overflow-visible
                    `
            },
            {
              className: buttonChromeVariants({ size: 'lg', variant: 'default' })
            }
          ).className
        )
      }
      render={(triggerProps, state) => {
        const renderedTriggerProps = { ...triggerProps } as typeof triggerProps & {
          'data-orientation'?: string
        }

        delete renderedTriggerProps['data-orientation']

        return (
          <RevealAnimation
            alignX="start"
            alignY="center"
            direction={orientation === 'vertical' ? 'left-to-right' : 'top-to-bottom'}
            render={renderRailsElement(
              'button',
              render ? (
                <RailsRenderedRailSurface
                  render={render}
                  state={normalizeRailsState(state, orientation)}
                />
              ) : undefined,
              mergeProps<'button'>(renderedTriggerProps, {
                onClick: (event: MouseEvent<HTMLElement>) => {
                  const preventableEvent = event as MouseEvent<HTMLElement> & {
                    preventBaseUIHandler?: () => void
                  }

                  if (state.open) {
                    preventableEvent.preventBaseUIHandler?.()
                  }
                }
              }),
              normalizeRailsState(state, orientation)
            )}
            reveal={state.open ? true : state.disabled ? false : undefined}
          >
            {railChildren}
          </RevealAnimation>
        )
      }}
      style={(state) => resolveRailsProp(style, normalizeRailsState(state, orientation))}
    />
  )
}

// Declaration merging exposes the documented Rails.Rail.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RailsRail {
  export type State = RailsRailState
  export type Props = RailsRailProps
}
