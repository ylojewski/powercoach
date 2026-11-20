import {
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithRef,
  type ReactElement,
  type Ref
} from 'react'

import { type AvatarMenuTriggerProps, type AvatarMenuTriggerState } from './AvatarMenuTrigger'
import { Avatar } from '../../Avatar'
import { avatarMenuContext, type AvatarMenuContextValue } from '../constants/avatarMenuContext'
import { avatarMenuItemValueContext } from '../constants/avatarMenuItemValueContext'
import { resolveAvatarMenuClassName } from '../utils/resolveAvatarMenuClassName'

export interface AvatarMenuTriggerSurfaceProps {
  active: boolean
  children: AvatarMenuTriggerProps['children']
  elementProps: ComponentPropsWithRef<'button'>
  state: AvatarMenuTriggerState
}

export function AvatarMenuTriggerSurface({
  active,
  children,
  elementProps,
  state
}: AvatarMenuTriggerSurfaceProps): ReactElement {
  const { orientation, registerTrigger, setPositioningTrigger } = useContext(
    avatarMenuContext
  ) as AvatarMenuContextValue
  const itemValue = useContext(avatarMenuItemValueContext)
  const avatarRef = useRef<HTMLSpanElement>(null)

  useImperativeHandle(
    elementProps.ref as Ref<HTMLButtonElement>,
    () => avatarRef.current as unknown as HTMLButtonElement
  )

  useLayoutEffect(() => {
    if (itemValue === undefined) {
      return undefined
    }

    registerTrigger(itemValue, avatarRef.current as unknown as HTMLButtonElement)

    return () => registerTrigger(itemValue, null)
  }, [itemValue, registerTrigger])

  useLayoutEffect(() => {
    setPositioningTrigger(avatarRef.current as unknown as HTMLButtonElement, active, state.open)
  }, [active, setPositioningTrigger, state.open])

  return (
    <Avatar.Root
      {...(elementProps as unknown as ComponentPropsWithRef<'span'>)}
      className={resolveAvatarMenuClassName(
        elementProps.className,
        state,
        orientation === 'horizontal'
          ? // prettier-ignore
            `
              overflow-visible
              translate-y-0 transition-[translate] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]
              data-active:translate-y-2.5 data-popup-open:translate-y-2.5
              data-popup-open:before:absolute data-popup-open:before:inset-x-0
              data-popup-open:before:bottom-full data-popup-open:before:h-2.5
              data-popup-open:before:content-['']
              motion-reduce:duration-0
            `
          : // prettier-ignore
            `
              overflow-visible
              translate-x-0 transition-[translate] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]
              data-active:translate-x-2.5 rtl:data-active:-translate-x-2.5
              data-popup-open:translate-x-2.5 rtl:data-popup-open:-translate-x-2.5
              data-popup-open:before:absolute data-popup-open:before:inset-y-0
              data-popup-open:before:end-full data-popup-open:before:w-2.5
              data-popup-open:before:content-['']
              motion-reduce:duration-0
            `
      )}
      render={<button />}
      ref={avatarRef}
      revealAnimationProps={active || state.open ? { reveal: true } : true}
      size="md"
    >
      {children}
    </Avatar.Root>
  )
}
