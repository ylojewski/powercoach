import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ComponentPropsWithRef,
  type ReactElement
} from 'react'

import { PopupSurfaceGroup, type PopupSurfaceGroupProps } from '../../PopupSurface'
import { Stripes, type StripesProps } from '../../Stripes'
import { avatarMenuGroupContext } from '../constants/avatarMenuGroupContext'

export type AvatarMenuGroupState = Record<string, never>

export type AvatarMenuGroupStripesProps = Omit<
  StripesProps,
  | 'aria-hidden'
  | 'aria-labelledby'
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'hidden'
  | 'inert'
  | 'render'
  | 'role'
>

export type AvatarMenuGroupProps = Omit<PopupSurfaceGroupProps, 'aria-labelledby' | 'role'> & {
  stripesProps?: boolean | AvatarMenuGroupStripesProps
}

export function AvatarMenuGroup({
  children,
  render,
  stripesProps = true,
  ...props
}: AvatarMenuGroupProps): ReactElement {
  const generatedGroupLabelId = useId()
  const leadingChild = Children.toArray(children)[0] as ReactElement<{ id?: string }>
  const suppliedGroupLabelId = leadingChild.props.id
  const groupLabelId = suppliedGroupLabelId ?? generatedGroupLabelId
  const renderElement = isValidElement(render) ? render : undefined
  const resolvedRender = renderElement
    ? cloneElement(renderElement, {
        'aria-labelledby': groupLabelId,
        role: 'group'
      } as ComponentPropsWithRef<'div'>)
    : typeof render === 'function'
      ? (elementProps: ComponentPropsWithRef<'div'>) =>
          render(
            {
              ...elementProps,
              'aria-labelledby': groupLabelId,
              role: 'group'
            },
            {}
          )
      : render

  return (
    <avatarMenuGroupContext.Provider value={{ groupLabelId }}>
      <PopupSurfaceGroup
        {...props}
        aria-labelledby={groupLabelId}
        render={resolvedRender}
        role="group"
      >
        {stripesProps === false ? (
          children
        ) : (
          <Stripes {...(typeof stripesProps === 'object' ? stripesProps : undefined)}>
            {children}
          </Stripes>
        )}
      </PopupSurfaceGroup>
    </avatarMenuGroupContext.Provider>
  )
}
