import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import {
  useEffect,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type Key,
  type ReactElement
} from 'react'

import { SwitchAnimationLayoutSnapshot } from './components/SwitchAnimationLayoutSnapshot'
import {
  getSwitchAnimationPixelSum,
  getSwitchAnimationTransforms,
  SWITCH_ANIMATION_FALLBACK_MOTION_STYLE,
  SWITCH_ANIMATION_REDUCED_MOTION_STYLE,
  SWITCH_ANIMATION_RENDER_STATE
} from './constants/switchAnimationConstants'
import { useSwitchAnimationLifecycle } from './hooks/useSwitchAnimationLifecycle'
import {
  type SwitchAnimationCompleteDetails,
  type SwitchAnimationContentMode,
  type SwitchAnimationDirection,
  type SwitchAnimationGenerationRuntime,
  type SwitchAnimationPresenceLayout,
  type SwitchAnimationRenderProps,
  type SwitchAnimationRenderState,
  type SwitchAnimationReplacementDetails,
  type SwitchAnimationStyle,
  type SwitchAnimationTransitionOwner
} from './types/SwitchAnimationTypes'

import './SwitchAnimation.css'

export type {
  SwitchAnimationCompleteDetails,
  SwitchAnimationCompletionStatus,
  SwitchAnimationContentMode,
  SwitchAnimationDirection,
  SwitchAnimationReplacementDetails
} from './types/SwitchAnimationTypes'

export interface SwitchAnimationProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  children: ReactElement
  contentMode?: SwitchAnimationContentMode
  direction?: SwitchAnimationDirection
  onSwitchChange?: (details: SwitchAnimationReplacementDetails) => void
  onSwitchComplete?: (details: SwitchAnimationCompleteDetails) => void
  onSwitchStart?: (details: SwitchAnimationReplacementDetails) => void
  ref?: SwitchAnimationRenderProps['ref']
  render?:
    | ReactElement
    | ((props: SwitchAnimationRenderProps, state: Record<string, never>) => ReactElement)
}

export function SwitchAnimation({
  children,
  contentMode = 'flow',
  direction = 'down',
  onSwitchChange,
  onSwitchComplete,
  onSwitchStart,
  ref: externalRef = null,
  render,
  style,
  ...props
}: SwitchAnimationProps): ReactElement | null {
  const [renderState, setRenderState] = useState<SwitchAnimationRenderState>(() => ({
    activeChild: children,
    activeKey: children.key as Key,
    activePresenceId: 0,
    completions: [],
    generations: [],
    leavingPresences: [],
    nextPresenceId: 1,
    nextReplacementId: 1
  }))
  const activePresenceIdRef = useRef(renderState.activePresenceId)
  const callbacksRef = useRef({ onSwitchChange, onSwitchComplete, onSwitchStart })
  const generationRuntimesRef = useRef(new Map<number, SwitchAnimationGenerationRuntime>())
  const itemElementsRef = useRef(new Map<number, HTMLElement>())
  const latestSizeGenerationIdRef = useRef(0)
  const ownedSizeRef = useRef(false)
  const pendingPresenceLayoutsRef = useRef(new Map<number, SwitchAnimationPresenceLayout>())
  const presenceLayoutsRef = useRef(new Map<number, SwitchAnimationPresenceLayout>())
  const rootElementRef = useRef<HTMLElement | null>(null)
  const transitionOwnersRef = useRef(
    new WeakMap<HTMLElement, Map<string, SwitchAnimationTransitionOwner>>()
  )

  if (renderState.activeKey !== children.key) {
    const incomingPresenceId = renderState.nextPresenceId
    const replacementId = renderState.nextReplacementId

    setRenderState({
      activeChild: children,
      activeKey: children.key as Key,
      activePresenceId: incomingPresenceId,
      completions: renderState.completions,
      generations: [
        ...renderState.generations,
        {
          direction,
          incomingPresenceId,
          leavingPresenceId: renderState.activePresenceId,
          nextKey: children.key as Key,
          previousKey: renderState.activeKey,
          replacementId
        }
      ],
      leavingPresences: [
        ...renderState.leavingPresences,
        {
          child: renderState.activeChild,
          presenceId: renderState.activePresenceId
        }
      ],
      nextPresenceId: incomingPresenceId + 1,
      nextReplacementId: replacementId + 1
    })
  }

  useLayoutEffect(() => {
    activePresenceIdRef.current = renderState.activePresenceId
    callbacksRef.current = { onSwitchChange, onSwitchComplete, onSwitchStart }
  }, [onSwitchChange, onSwitchComplete, onSwitchStart, renderState.activePresenceId])

  const finishGeneration = (runtime: SwitchAnimationGenerationRuntime) => {
    for (const cleanup of runtime.cleanup) cleanup()

    for (const ownedTransition of runtime.ownedTransitions) {
      const owners = transitionOwnersRef.current.get(ownedTransition.element)
      const owner = owners?.get(ownedTransition.propertyName)

      if (
        owner?.replacementId === runtime.details.replacementId &&
        owner.token === ownedTransition.token
      ) {
        owners?.delete(ownedTransition.propertyName)
      }
    }

    generationRuntimesRef.current.delete(runtime.details.replacementId)
    presenceLayoutsRef.current.delete(runtime.leavingPresenceId)

    if (latestSizeGenerationIdRef.current === runtime.details.replacementId) {
      const rootElement = rootElementRef.current as HTMLElement

      rootElement.style.removeProperty('width')
      rootElement.style.removeProperty('height')
      rootElement.style.transitionDuration = 'var(--switch-animation-duration)'
      rootElement.style.transitionTimingFunction = 'var(--switch-animation-easing)'
      ownedSizeRef.current = false
    }

    if (activePresenceIdRef.current === runtime.incomingPresenceId) {
      runtime.incomingElement.style.removeProperty('width')
      runtime.incomingElement.style.removeProperty('height')
      runtime.incomingElement.style.transitionDelay = '0ms'
      runtime.incomingElement.style.transitionDuration = 'var(--switch-animation-duration)'
      runtime.incomingElement.style.transitionTimingFunction = 'var(--switch-animation-easing)'
    }

    setRenderState((current) => ({
      ...current,
      completions: [
        ...current.completions,
        {
          ...runtime.details,
          status: runtime.status
        }
      ],
      generations: current.generations.filter(
        (generation) => generation.replacementId !== runtime.details.replacementId
      ),
      leavingPresences: current.leavingPresences.filter(
        (presence) => presence.presenceId !== runtime.leavingPresenceId
      )
    }))
  }

  const { isTransitionPending, reducedMotion, scheduleGenerationCompletion } =
    useSwitchAnimationLifecycle({
      finishGeneration,
      generationRuntimesRef,
      rootElementRef
    })
  const fallbackMotionVariablesRef = useRef(new Set<string>())

  useLayoutEffect(() => {
    const rootElement = rootElementRef.current as HTMLElement
    const consumerStyle = style as SwitchAnimationStyle | undefined

    for (const variable of fallbackMotionVariablesRef.current) {
      const hasConsumerValue = consumerStyle?.[variable as keyof SwitchAnimationStyle] !== undefined
      const hasReducedMotionValue =
        reducedMotion &&
        SWITCH_ANIMATION_REDUCED_MOTION_STYLE[
          variable as keyof typeof SWITCH_ANIMATION_REDUCED_MOTION_STYLE
        ] !== undefined

      if (!hasConsumerValue && !hasReducedMotionValue) rootElement.style.removeProperty(variable)
    }

    fallbackMotionVariablesRef.current.clear()

    const computedStyle = getComputedStyle(rootElement)

    for (const [variable, fallback] of Object.entries(SWITCH_ANIMATION_FALLBACK_MOTION_STYLE)) {
      if (computedStyle.getPropertyValue(variable).trim() !== '') continue

      rootElement.style.setProperty(variable, fallback)
      fallbackMotionVariablesRef.current.add(variable)
    }
  }, [props.className, reducedMotion, style])

  const settleTransition = (
    runtime: SwitchAnimationGenerationRuntime,
    token: string,
    interrupted: boolean
  ) => {
    runtime.pending.delete(token)

    if (interrupted) runtime.status = 'interrupted'
    if (runtime.pending.size === 0) finishGeneration(runtime)
  }

  const claimTransition = (
    runtime: SwitchAnimationGenerationRuntime,
    element: HTMLElement,
    propertyName: string,
    token: string,
    pending: boolean,
    retargeted: boolean
  ) => {
    if (!pending) return

    let owners = transitionOwnersRef.current.get(element)

    if (owners === undefined) {
      owners = new Map<string, SwitchAnimationTransitionOwner>()
      transitionOwnersRef.current.set(element, owners)
    }

    owners.set(propertyName, {
      activationTimeStamp: null,
      replacementId: runtime.details.replacementId,
      token
    })
    runtime.ownedTransitions.push({ element, propertyName, token })
    runtime.pending.add(token)

    if (retargeted) runtime.suppressedCancels.add(token)
  }

  const releasePreviousTransition = (element: HTMLElement, propertyName: string) => {
    const owners = transitionOwnersRef.current.get(element)
    const previousOwner = owners?.get(propertyName)

    if (previousOwner === undefined) return false

    const previousRuntime = generationRuntimesRef.current.get(
      previousOwner.replacementId
    ) as SwitchAnimationGenerationRuntime

    owners?.delete(propertyName)
    settleTransition(previousRuntime, previousOwner.token, true)
    return true
  }

  const observeTransitions = (
    runtime: SwitchAnimationGenerationRuntime,
    element: HTMLElement,
    tokenPrefix: string,
    propertyNames: string[]
  ) => {
    const handleTransition = (event: Event) => {
      const transitionEvent = event as TransitionEvent

      if (
        transitionEvent.target !== element ||
        !propertyNames.includes(transitionEvent.propertyName)
      ) {
        return
      }

      const token = `${tokenPrefix}:${transitionEvent.propertyName}`
      const owner = transitionOwnersRef.current.get(element)?.get(transitionEvent.propertyName)

      if (owner?.replacementId !== runtime.details.replacementId || owner.token !== token) {
        return
      }

      if (owner.activationTimeStamp === null || event.timeStamp < owner.activationTimeStamp) {
        runtime.suppressedCancels.delete(token)
        return
      }

      if (event.type === 'transitioncancel' && runtime.suppressedCancels.delete(token)) return

      settleTransition(runtime, token, event.type === 'transitioncancel')
    }

    element.addEventListener('transitioncancel', handleTransition)
    element.addEventListener('transitionend', handleTransition)
    runtime.cleanup.add(() => {
      element.removeEventListener('transitioncancel', handleTransition)
      element.removeEventListener('transitionend', handleTransition)
    })
  }

  useEffect(() => {
    return () => {
      for (const runtime of generationRuntimesRef.current.values()) {
        for (const cleanup of runtime.cleanup) cleanup()
      }

      generationRuntimesRef.current.clear()
    }
  }, [])

  useLayoutEffect(() => {
    if (renderState.activeKey === children.key && renderState.activeChild !== children) {
      setRenderState((current) => ({ ...current, activeChild: children }))
    }

    for (const completion of renderState.completions) {
      callbacksRef.current.onSwitchComplete?.(completion)
    }

    if (renderState.completions.length > 0) {
      setRenderState((current) => ({ ...current, completions: [] }))
    }
  }, [children, renderState.activeChild, renderState.activeKey, renderState.completions])

  useLayoutEffect(() => {
    if (ownedSizeRef.current || renderState.generations.length > 0) return

    const rootElement = rootElementRef.current as HTMLElement
    const activeElement = itemElementsRef.current.get(renderState.activePresenceId) as HTMLElement
    const rootRect = rootElement.getBoundingClientRect()
    const activeRect = activeElement.getBoundingClientRect()

    presenceLayoutsRef.current.set(renderState.activePresenceId, {
      element: activeElement,
      height: activeRect.height,
      left: activeRect.left - rootRect.left - rootElement.clientLeft,
      rootHeight: rootRect.height,
      rootWidth: rootRect.width,
      top: activeRect.top - rootRect.top - rootElement.clientTop,
      width: activeRect.width
    })
  }, [children, renderState.generations])

  useInsertionEffect(() => {
    for (const presence of renderState.leavingPresences) {
      const pendingLayout = pendingPresenceLayoutsRef.current.get(presence.presenceId)

      if (pendingLayout !== undefined) {
        presenceLayoutsRef.current.set(presence.presenceId, pendingLayout)
        pendingPresenceLayoutsRef.current.delete(presence.presenceId)
      }

      const layout =
        pendingLayout ??
        (presenceLayoutsRef.current.get(presence.presenceId) as SwitchAnimationPresenceLayout)

      layout.element.style.height = `${layout.height}px`
      layout.element.style.left = `${layout.left}px`
      layout.element.style.position = 'absolute'
      layout.element.style.top = `${layout.top}px`
      layout.element.style.width = `${layout.width}px`
    }
  }, [renderState.leavingPresences])

  useLayoutEffect(() => {
    const rootElement = rootElementRef.current as HTMLElement

    for (const generation of renderState.generations) {
      if (generationRuntimesRef.current.has(generation.replacementId)) continue

      const leavingElement = itemElementsRef.current.get(
        generation.leavingPresenceId
      ) as HTMLElement
      const incomingElement = itemElementsRef.current.get(
        generation.incomingPresenceId
      ) as HTMLElement
      const details = {
        direction: generation.direction,
        nextKey: generation.nextKey,
        previousKey: generation.previousKey,
        replacementId: generation.replacementId
      } as const satisfies SwitchAnimationReplacementDetails
      const runtime: SwitchAnimationGenerationRuntime = {
        cleanup: new Set(),
        details,
        incomingElement,
        incomingPresenceId: generation.incomingPresenceId,
        leavingElement,
        leavingPresenceId: generation.leavingPresenceId,
        ownedTransitions: [],
        pending: new Set(),
        status: 'finished',
        suppressedCancels: new Set()
      }

      generationRuntimesRef.current.set(generation.replacementId, runtime)
      latestSizeGenerationIdRef.current = generation.replacementId

      const rootComputedStyle = getComputedStyle(rootElement)
      const duration = rootComputedStyle.getPropertyValue('--switch-animation-duration').trim()
      const distance = rootComputedStyle.getPropertyValue('--switch-animation-distance').trim()
      const easing = rootComputedStyle.getPropertyValue('--switch-animation-easing').trim()
      const stagger = rootComputedStyle.getPropertyValue('--switch-animation-stagger').trim()
      const transforms = getSwitchAnimationTransforms(generation.direction, distance)
      const leavingComputedStyle = getComputedStyle(leavingElement)
      const leavingOpacity = leavingComputedStyle.opacity
      const leavingTransform = leavingComputedStyle.transform
      const currentRootWidth = Number.parseFloat(rootComputedStyle.width)
      const currentRootHeight = Number.parseFloat(rootComputedStyle.height)
      const horizontalRootEdges = getSwitchAnimationPixelSum(
        rootComputedStyle.borderLeftWidth,
        rootComputedStyle.borderRightWidth,
        rootComputedStyle.paddingLeft,
        rootComputedStyle.paddingRight
      )
      const verticalRootEdges = getSwitchAnimationPixelSum(
        rootComputedStyle.borderBottomWidth,
        rootComputedStyle.borderTopWidth,
        rootComputedStyle.paddingBottom,
        rootComputedStyle.paddingTop
      )
      const leavingOpacityRetargeted = releasePreviousTransition(leavingElement, 'opacity')
      const leavingTransformRetargeted = releasePreviousTransition(leavingElement, 'transform')
      const rootWidthRetargeted = releasePreviousTransition(rootElement, 'width')
      const rootHeightRetargeted = releasePreviousTransition(rootElement, 'height')

      rootElement.style.transitionProperty = 'none'
      leavingElement.style.transitionProperty = 'none'
      leavingElement.style.opacity = leavingOpacity
      leavingElement.style.transform = 'none'
      incomingElement.style.transitionProperty = 'none'
      incomingElement.style.opacity = '1'
      incomingElement.style.position = 'absolute'
      incomingElement.style.transform = 'none'

      const rootRect = rootElement.getBoundingClientRect()
      const leavingRect = leavingElement.getBoundingClientRect()
      const previousContentWidth = leavingRect.width + horizontalRootEdges
      const previousContentHeight = leavingRect.height + verticalRootEdges
      const previousLayout = presenceLayoutsRef.current.get(
        generation.leavingPresenceId
      ) as SwitchAnimationPresenceLayout
      const settledRootWidth = previousLayout.rootWidth
      const settledRootHeight = previousLayout.rootHeight
      const startWidth =
        ownedSizeRef.current && Number.isFinite(currentRootWidth)
          ? currentRootWidth
          : settledRootWidth === 0 && previousContentWidth > 0
            ? previousContentWidth
            : settledRootWidth
      const startHeight =
        ownedSizeRef.current && Number.isFinite(currentRootHeight)
          ? currentRootHeight
          : settledRootHeight === 0 && previousContentHeight > 0
            ? previousContentHeight
            : settledRootHeight

      leavingElement.style.left = `${leavingRect.left - rootRect.left - rootElement.clientLeft}px`
      leavingElement.style.top = `${leavingRect.top - rootRect.top - rootElement.clientTop}px`
      leavingElement.style.width = `${leavingRect.width}px`
      leavingElement.style.height = `${leavingRect.height}px`
      leavingElement.style.position = 'absolute'
      leavingElement.style.zIndex = '1'
      leavingElement.style.opacity = leavingOpacity
      leavingElement.style.transform = leavingTransform

      rootElement.style.removeProperty('width')
      rootElement.style.removeProperty('height')
      incomingElement.style.position = 'relative'

      const activeElement = document.activeElement
      const outgoingContentRoot = leavingElement.firstElementChild as HTMLElement

      if (outgoingContentRoot.contains(activeElement)) {
        const incomingContentRoot = incomingElement.firstElementChild as HTMLElement

        incomingContentRoot.focus({ preventScroll: true })
      }

      leavingElement.setAttribute('aria-hidden', 'true')
      leavingElement.setAttribute('inert', '')
      leavingElement.style.pointerEvents = 'none'

      const incomingRect = incomingElement.getBoundingClientRect()
      const incomingLayoutRootRect = rootElement.getBoundingClientRect()
      let incomingRootRect = incomingLayoutRootRect

      if (rootElement.getClientRects().length === 0) {
        const layoutlessRoot = rootElement.cloneNode(false) as HTMLElement
        const layoutlessSlot = (rootElement.firstElementChild as HTMLElement).cloneNode(
          false
        ) as HTMLElement
        const layoutlessIncoming = incomingElement.cloneNode(true) as HTMLElement

        layoutlessSlot.append(layoutlessIncoming)
        layoutlessRoot.append(layoutlessSlot)

        const layoutlessRootRect = layoutlessRoot.getBoundingClientRect()

        if (layoutlessRootRect.width !== 0 || layoutlessRootRect.height !== 0) {
          incomingRootRect = layoutlessRootRect
        }
      }

      presenceLayoutsRef.current.set(generation.incomingPresenceId, {
        element: incomingElement,
        height: incomingRect.height,
        left: incomingRect.left - incomingLayoutRootRect.left - rootElement.clientLeft,
        rootHeight: incomingRootRect.height,
        rootWidth: incomingRootRect.width,
        top: incomingRect.top - incomingLayoutRootRect.top - rootElement.clientTop,
        width: incomingRect.width
      })

      incomingElement.style.width = `${incomingRect.width}px`
      incomingElement.style.height = `${incomingRect.height}px`

      const targetWidth = incomingRootRect.width || incomingRect.width + horizontalRootEdges
      const targetHeight = incomingRootRect.height || incomingRect.height + verticalRootEdges

      rootElement.style.width = `${startWidth}px`
      rootElement.style.height = `${startHeight}px`
      ownedSizeRef.current = true

      incomingElement.style.opacity = '0'
      incomingElement.style.transform = transforms.entering

      rootElement.getBoundingClientRect()

      const leavingStartComputedStyle = getComputedStyle(leavingElement)
      const leavingStartOpacity = leavingStartComputedStyle.opacity
      const leavingStartTransform = leavingStartComputedStyle.transform
      const incomingStartComputedStyle = getComputedStyle(incomingElement)
      const incomingStartOpacity = incomingStartComputedStyle.opacity
      const incomingStartTransform = incomingStartComputedStyle.transform
      const rootStartComputedStyle = getComputedStyle(rootElement)
      const rootStartWidth = rootStartComputedStyle.width
      const rootStartHeight = rootStartComputedStyle.height

      leavingElement.style.opacity = '0'
      leavingElement.style.transform = transforms.leaving
      incomingElement.style.opacity = '1'
      incomingElement.style.transform = 'none'
      rootElement.style.width = `${targetWidth}px`
      rootElement.style.height = `${targetHeight}px`

      const leavingEndComputedStyle = getComputedStyle(leavingElement)
      const leavingEndOpacity = leavingEndComputedStyle.opacity
      const leavingEndTransform = leavingEndComputedStyle.transform
      const incomingEndComputedStyle = getComputedStyle(incomingElement)
      const incomingEndOpacity = incomingEndComputedStyle.opacity
      const incomingEndTransform = incomingEndComputedStyle.transform
      const rootEndComputedStyle = getComputedStyle(rootElement)
      const rootEndWidth = rootEndComputedStyle.width
      const rootEndHeight = rootEndComputedStyle.height

      leavingElement.style.opacity = leavingStartOpacity
      leavingElement.style.transform = leavingStartTransform
      incomingElement.style.opacity = incomingStartOpacity
      incomingElement.style.transform = incomingStartTransform
      rootElement.style.width = rootStartWidth
      rootElement.style.height = rootStartHeight

      const restoredLeavingStartComputedStyle = getComputedStyle(leavingElement)
      const restoredLeavingStartOpacity = restoredLeavingStartComputedStyle.opacity
      const restoredLeavingStartTransform = restoredLeavingStartComputedStyle.transform
      const restoredIncomingStartComputedStyle = getComputedStyle(incomingElement)
      const restoredIncomingStartOpacity = restoredIncomingStartComputedStyle.opacity
      const restoredIncomingStartTransform = restoredIncomingStartComputedStyle.transform
      const restoredRootStartComputedStyle = getComputedStyle(rootElement)
      const restoredRootStartWidth = restoredRootStartComputedStyle.width
      const restoredRootStartHeight = restoredRootStartComputedStyle.height

      rootElement.style.transitionDelay = '0ms'
      rootElement.style.transitionDuration = duration
      rootElement.style.transitionProperty = 'width, height'
      rootElement.style.transitionTimingFunction = easing
      leavingElement.style.transitionDelay = '0ms'
      leavingElement.style.transitionDuration = duration
      leavingElement.style.transitionProperty = 'opacity, transform'
      leavingElement.style.transitionTimingFunction = easing
      incomingElement.style.transitionDelay = stagger
      incomingElement.style.transitionDuration = duration
      incomingElement.style.transitionProperty = 'opacity, transform'
      incomingElement.style.transitionTimingFunction = easing

      const leavingTransitionStyle = getComputedStyle(leavingElement)
      const incomingTransitionStyle = getComputedStyle(incomingElement)
      const rootTransitionStyle = getComputedStyle(rootElement)

      claimTransition(
        runtime,
        leavingElement,
        'opacity',
        'leaving:opacity',
        isTransitionPending({
          endValue: leavingEndOpacity,
          propertyIndex: 0,
          startValue: restoredLeavingStartOpacity,
          transitionDelay: leavingTransitionStyle.transitionDelay,
          transitionDuration: leavingTransitionStyle.transitionDuration
        }),
        leavingOpacityRetargeted
      )
      claimTransition(
        runtime,
        leavingElement,
        'transform',
        'leaving:transform',
        isTransitionPending({
          endValue: leavingEndTransform,
          propertyIndex: 1,
          startValue: restoredLeavingStartTransform,
          transitionDelay: leavingTransitionStyle.transitionDelay,
          transitionDuration: leavingTransitionStyle.transitionDuration
        }),
        leavingTransformRetargeted
      )
      claimTransition(
        runtime,
        incomingElement,
        'opacity',
        'incoming:opacity',
        isTransitionPending({
          endValue: incomingEndOpacity,
          propertyIndex: 0,
          startValue: restoredIncomingStartOpacity,
          transitionDelay: incomingTransitionStyle.transitionDelay,
          transitionDuration: incomingTransitionStyle.transitionDuration
        }),
        false
      )
      claimTransition(
        runtime,
        incomingElement,
        'transform',
        'incoming:transform',
        isTransitionPending({
          endValue: incomingEndTransform,
          propertyIndex: 1,
          startValue: restoredIncomingStartTransform,
          transitionDelay: incomingTransitionStyle.transitionDelay,
          transitionDuration: incomingTransitionStyle.transitionDuration
        }),
        false
      )
      claimTransition(
        runtime,
        rootElement,
        'width',
        'root:width',
        isTransitionPending({
          endValue: rootEndWidth,
          propertyIndex: 0,
          startValue: restoredRootStartWidth,
          transitionDelay: rootTransitionStyle.transitionDelay,
          transitionDuration: rootTransitionStyle.transitionDuration
        }),
        rootWidthRetargeted
      )
      claimTransition(
        runtime,
        rootElement,
        'height',
        'root:height',
        isTransitionPending({
          endValue: rootEndHeight,
          propertyIndex: 1,
          startValue: restoredRootStartHeight,
          transitionDelay: rootTransitionStyle.transitionDelay,
          transitionDuration: rootTransitionStyle.transitionDuration
        }),
        rootHeightRetargeted
      )

      observeTransitions(runtime, leavingElement, 'leaving', ['opacity', 'transform'])
      observeTransitions(runtime, incomingElement, 'incoming', ['opacity', 'transform'])
      observeTransitions(runtime, rootElement, 'root', ['width', 'height'])

      callbacksRef.current.onSwitchChange?.(details)

      const activationTimeStamp = new Event('switch-animation-activation').timeStamp

      for (const ownedTransition of runtime.ownedTransitions) {
        const owner = transitionOwnersRef.current
          .get(ownedTransition.element)
          ?.get(ownedTransition.propertyName) as SwitchAnimationTransitionOwner

        owner.activationTimeStamp = activationTimeStamp
      }

      leavingElement.style.opacity = leavingEndOpacity
      leavingElement.style.transform = leavingEndTransform
      incomingElement.style.opacity = incomingEndOpacity
      incomingElement.style.transform = incomingEndTransform
      rootElement.style.width = rootEndWidth
      rootElement.style.height = rootEndHeight

      callbacksRef.current.onSwitchStart?.(details)

      if (runtime.pending.size === 0) {
        scheduleGenerationCompletion(runtime)
      }
    }
  }, [renderState.generations, scheduleGenerationCompletion])

  const RootElement = contentMode === 'flow' ? 'div' : 'span'
  const OwnedElement = contentMode === 'flow' ? 'div' : 'span'
  const rootStyle = {
    ...(style as SwitchAnimationStyle),
    ...(reducedMotion ? SWITCH_ANIMATION_REDUCED_MOTION_STYLE : {}),
    boxSizing: 'border-box',
    display: 'inline-block',
    isolation: 'isolate',
    position: 'relative',
    transitionDelay: '0ms',
    transitionDuration: 'var(--switch-animation-duration)',
    transitionProperty: 'width, height',
    transitionTimingFunction: 'var(--switch-animation-easing)',
    verticalAlign: contentMode === 'flow' ? 'top' : 'baseline'
  } as const satisfies SwitchAnimationStyle
  const itemStyle = {
    boxSizing: 'border-box',
    display: contentMode === 'flow' ? 'block' : 'inline-block',
    opacity: 1,
    position: 'relative',
    transform: 'none',
    transitionDelay: '0ms',
    transitionDuration: 'var(--switch-animation-duration)',
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: 'var(--switch-animation-easing)'
  } as const
  const slotStyle = {
    boxSizing: 'border-box',
    display: contentMode === 'flow' ? 'block' : 'inline-block',
    minHeight: 0,
    minWidth: 0,
    position: 'static'
  } as const
  const ownedItems = renderState.leavingPresences.map((presence) => (
    <OwnedElement
      key={presence.presenceId}
      ref={(element) => {
        if (element === null) itemElementsRef.current.delete(presence.presenceId)
        else itemElementsRef.current.set(presence.presenceId, element)
      }}
      style={itemStyle}
    >
      {presence.child}
    </OwnedElement>
  ))

  ownedItems.push(
    <OwnedElement
      key={renderState.activePresenceId}
      ref={(element) => {
        if (element === null) itemElementsRef.current.delete(renderState.activePresenceId)
        else itemElementsRef.current.set(renderState.activePresenceId, element)
      }}
      style={itemStyle}
    >
      {children}
    </OwnedElement>
  )

  const ownedChildren = (
    <SwitchAnimationLayoutSnapshot
      activePresenceId={renderState.activePresenceId}
      itemElementsRef={itemElementsRef}
      ownedSizeRef={ownedSizeRef}
      pendingPresenceLayoutsRef={pendingPresenceLayoutsRef}
      presenceLayoutsRef={presenceLayoutsRef}
      rootElementRef={rootElementRef}
    >
      <OwnedElement style={slotStyle}>{ownedItems}</OwnedElement>
    </SwitchAnimationLayoutSnapshot>
  )

  return useRender({
    defaultTagName: RootElement,
    props: mergeProps<'div'>(props, {
      children: ownedChildren,
      'data-content-mode': contentMode,
      'data-direction': direction,
      'data-motion': 'switch',
      style: rootStyle
    } as useRender.ElementProps<'div'>),
    ref: [rootElementRef, externalRef],
    render,
    state: SWITCH_ANIMATION_RENDER_STATE
  })
}
