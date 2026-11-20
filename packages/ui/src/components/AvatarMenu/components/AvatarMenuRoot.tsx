import {
  DirectionProvider as BaseUiDirectionProvider,
  useDirection
} from '@base-ui/react/direction-provider'
import { NavigationMenu as BaseUiNavigationMenu } from '@base-ui/react/navigation-menu'
import {
  Children,
  isValidElement,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref
} from 'react'

import { AvatarMenuItem } from './AvatarMenuItem'
import { AvatarMenuTrigger } from './AvatarMenuTrigger'
import {
  avatarMenuContext,
  type AvatarMenuActivationDirection,
  type AvatarMenuPositioningAnchor
} from '../constants/avatarMenuContext'

function resolveAvatarMenuAnchorRect(element: Element): DOMRect {
  const rect = element.getBoundingClientRect()
  const [translateX = '0', translateY = '0'] = window.getComputedStyle(element).translate.split(' ')
  const x = rect.x - (Number.parseFloat(translateX) || 0)
  const y = rect.y - (Number.parseFloat(translateY) || 0)

  return new DOMRect(x, y, rect.width, rect.height)
}

export type AvatarMenuRootValue = BaseUiNavigationMenu.Root.Value
export type AvatarMenuRootActions = BaseUiNavigationMenu.Root.Actions
export type AvatarMenuRootChangeEventReason = BaseUiNavigationMenu.Root.ChangeEventReason
export type AvatarMenuRootChangeEventDetails = BaseUiNavigationMenu.Root.ChangeEventDetails
export type AvatarMenuRootState = BaseUiNavigationMenu.Root.State
export type AvatarMenuRootProps = Omit<BaseUiNavigationMenu.Root.Props, 'delay'>

export function AvatarMenuRoot({
  children,
  defaultValue,
  onOpenChangeComplete,
  onValueChange,
  orientation = 'vertical',
  ref,
  value,
  ...props
}: AvatarMenuRootProps): ReactElement {
  const inheritedBaseUiDirection = useDirection()
  const rootRef = useRef<HTMLElement>(null)
  const triggerElementsRef = useRef(new Map<unknown, HTMLButtonElement>())
  const previousValueRef = useRef(value)
  const lastNonNullValueRef = useRef(value ?? null)
  const activationDirectionRef = useRef<AvatarMenuActivationDirection>(null)
  const [direction, setDirection] = useState(inheritedBaseUiDirection)
  const [[positioningTrigger, positioningTriggerActive], setPositioningTriggerState] = useState<
    readonly [HTMLButtonElement | null, boolean]
  >(() => {
    const initialValue = value === undefined ? (defaultValue ?? null) : value
    const resolveInitialTriggerActive = (
      nodes: ReactNode,
      itemValue?: unknown
    ): boolean | undefined => {
      for (const node of Children.toArray(nodes)) {
        if (
          !isValidElement<{
            active?: boolean
            children?: ReactNode
            value?: unknown
          }>(node)
        ) {
          continue
        }

        const nextItemValue = node.type === AvatarMenuItem ? node.props.value : itemValue

        if (node.type === AvatarMenuTrigger && Object.is(itemValue, initialValue)) {
          return node.props.active === true
        }

        const nestedTriggerActive = resolveInitialTriggerActive(node.props.children, nextItemValue)

        if (nestedTriggerActive !== undefined) {
          return nestedTriggerActive
        }
      }

      return undefined
    }

    return [null, resolveInitialTriggerActive(children) ?? false]
  })
  const controlled = value !== undefined

  if (controlled && !Object.is(previousValueRef.current, value)) {
    const previousValue = lastNonNullValueRef.current

    if (previousValue != null && value != null && !Object.is(previousValue, value)) {
      const previousTrigger = triggerElementsRef.current.get(previousValue)
      const nextTrigger = triggerElementsRef.current.get(value)
      const previousRect = previousTrigger?.getBoundingClientRect()
      const nextRect = nextTrigger?.getBoundingClientRect()
      const documentPosition =
        previousTrigger && nextTrigger ? previousTrigger.compareDocumentPosition(nextTrigger) : 0

      if (previousRect && nextRect) {
        const axisDelta =
          orientation === 'horizontal' ? nextRect.x - previousRect.x : nextRect.y - previousRect.y

        if (axisDelta > 0) {
          activationDirectionRef.current = orientation === 'horizontal' ? 'right' : 'down'
        } else if (axisDelta < 0) {
          activationDirectionRef.current = orientation === 'horizontal' ? 'left' : 'up'
        } else if (documentPosition && documentPosition & Node.DOCUMENT_POSITION_FOLLOWING) {
          activationDirectionRef.current =
            orientation === 'horizontal' ? (direction === 'rtl' ? 'left' : 'right') : 'down'
        } else if (documentPosition && documentPosition & Node.DOCUMENT_POSITION_PRECEDING) {
          activationDirectionRef.current =
            orientation === 'horizontal' ? (direction === 'rtl' ? 'right' : 'left') : 'up'
        } else {
          activationDirectionRef.current = null
        }
      } else {
        activationDirectionRef.current = null
      }
    } else {
      activationDirectionRef.current = null
    }

    previousValueRef.current = value

    if (value != null) {
      lastNonNullValueRef.current = value
    }
  } else if (!controlled) {
    activationDirectionRef.current = null
    lastNonNullValueRef.current = null
    previousValueRef.current = value
  }

  const registerTrigger = useCallback((itemValue: unknown, element: HTMLButtonElement | null) => {
    if (element) {
      triggerElementsRef.current.set(itemValue, element)
    } else {
      triggerElementsRef.current.delete(itemValue)
    }
  }, [])
  const setPositioningTrigger = useCallback(
    (element: HTMLButtonElement, active: boolean, open: boolean) => {
      setPositioningTriggerState((current) =>
        open || current[0] === element ? [element, active] : current
      )
    },
    []
  )
  const handleValueChange = useCallback(
    (nextValue: AvatarMenuRootValue, eventDetails: AvatarMenuRootChangeEventDetails) => {
      onValueChange?.(nextValue, eventDetails)

      if (nextValue == null || eventDetails.isCanceled) {
        return
      }

      const registeredTrigger = triggerElementsRef.current.get(nextValue)
      const nextTrigger =
        registeredTrigger ??
        (eventDetails.event.target as Element).closest<HTMLButtonElement>('button')

      if (nextTrigger) {
        setPositioningTriggerState([nextTrigger, nextTrigger.hasAttribute('data-active')])
      }
    },
    [onValueChange]
  )
  const controlledPositioningTrigger =
    controlled && value != null ? triggerElementsRef.current.get(value) : undefined
  const resolvedPositioningTrigger = controlledPositioningTrigger ?? positioningTrigger
  const resolvedPositioningTriggerActive = controlledPositioningTrigger
    ? controlledPositioningTrigger.hasAttribute('data-active')
    : positioningTriggerActive
  const positioningAnchor = useMemo<AvatarMenuPositioningAnchor | null>(
    () =>
      resolvedPositioningTrigger
        ? {
            contextElement: resolvedPositioningTrigger,
            getBoundingClientRect: () => resolveAvatarMenuAnchorRect(resolvedPositioningTrigger)
          }
        : null,
    [resolvedPositioningTrigger]
  )
  const context = useMemo(
    () => ({
      activationDirection: activationDirectionRef.current,
      controlled,
      orientation,
      positioningAnchor,
      positioningTriggerActive: resolvedPositioningTriggerActive,
      registerTrigger,
      setPositioningTrigger
    }),
    [
      controlled,
      orientation,
      positioningAnchor,
      resolvedPositioningTriggerActive,
      registerTrigger,
      setPositioningTrigger,
      value
    ]
  )
  const handleOpenChangeComplete = useCallback(
    (open: boolean) => {
      lastNonNullValueRef.current = null
      onOpenChangeComplete?.(open)
    },
    [onOpenChangeComplete]
  )
  useImperativeHandle(ref as Ref<HTMLElement>, () => rootRef.current as HTMLElement)

  useLayoutEffect(() => {
    const htmlDirection = rootRef.current
      ?.closest<HTMLElement>('[dir="ltr"], [dir="rtl"]')
      ?.getAttribute('dir')
    const nextDirection =
      htmlDirection === 'ltr' || htmlDirection === 'rtl' ? htmlDirection : inheritedBaseUiDirection

    setDirection((currentDirection) =>
      currentDirection === nextDirection ? currentDirection : nextDirection
    )
  })

  return (
    <avatarMenuContext.Provider value={context}>
      <BaseUiDirectionProvider direction={direction}>
        <BaseUiNavigationMenu.Root
          {...props}
          defaultValue={defaultValue}
          delay={0}
          onOpenChangeComplete={handleOpenChangeComplete}
          onValueChange={handleValueChange}
          orientation={orientation}
          ref={rootRef}
          value={value}
        >
          {children}
        </BaseUiNavigationMenu.Root>
      </BaseUiDirectionProvider>
    </avatarMenuContext.Provider>
  )
}
