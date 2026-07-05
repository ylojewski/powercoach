import {
  useContext,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode
} from 'react'
import { twMerge } from 'tailwind-merge'

import { Heading } from '../../Heading'
import { PopupSurfaceGroupLabel, type PopupSurfaceGroupLabelProps } from '../../PopupSurface'
import { avatarMenuGroupContext } from '../constants/avatarMenuGroupContext'

export type AvatarMenuGroupLabelState = Record<string, never>

export type AvatarMenuGroupLabelProps = Omit<
  PopupSurfaceGroupLabelProps,
  'children' | 'className' | 'render' | 'style'
> & {
  children: ReactNode
  className?: string | ((state: AvatarMenuGroupLabelState) => string | undefined)
  render?:
    | ReactElement
    | ((props: ComponentPropsWithRef<'div'>, state: AvatarMenuGroupLabelState) => ReactElement)
  style?: CSSProperties | ((state: AvatarMenuGroupLabelState) => CSSProperties | undefined)
}

export function AvatarMenuGroupLabel({
  children,
  className,
  id,
  render,
  style,
  ...props
}: AvatarMenuGroupLabelProps): ReactElement {
  const groupContext = useContext(avatarMenuGroupContext)
  const groupLabelId = id ?? groupContext?.groupLabelId
  const consumerClassName = typeof className === 'function' ? className({}) : className
  const consumerStyle = typeof style === 'function' ? style({}) : style

  return (
    <Heading
      {...(props as ComponentPropsWithRef<'span'>)}
      className={twMerge(
        'flex min-h-[calc(2.25rem-2px)] items-center py-0 ps-8 pe-2.5',
        consumerClassName
      )}
      id={groupLabelId}
      render={(headingProps) => (
        <PopupSurfaceGroupLabel
          {...(headingProps as ComponentPropsWithRef<'div'>)}
          render={
            typeof render === 'function'
              ? (surfaceProps) => render(surfaceProps, {})
              : (render ?? <div />)
          }
        />
      )}
      size="md"
      style={consumerStyle}
      tone="muted"
    >
      {children}
    </Heading>
  )
}
