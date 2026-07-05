import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

import { SWITCH_ANIMATION_REDUCED_MOTION_QUERY } from '../constants/switchAnimationConstants'
import { type SwitchAnimationGenerationRuntime } from '../types/SwitchAnimationTypes'

export interface UseSwitchAnimationLifecycleProps {
  finishGeneration: (runtime: SwitchAnimationGenerationRuntime) => void
  generationRuntimesRef: RefObject<Map<number, SwitchAnimationGenerationRuntime>>
  rootElementRef: RefObject<HTMLElement | null>
}

export interface UseSwitchAnimationLifecycleResult {
  isTransitionPending: (evaluation: SwitchAnimationTransitionEvaluation) => boolean
  reducedMotion: boolean
  scheduleGenerationCompletion: (runtime: SwitchAnimationGenerationRuntime) => void
}

export interface SwitchAnimationTransitionEvaluation {
  endValue: string
  propertyIndex: number
  startValue: string
  transitionDelay: string
  transitionDuration: string
}

export function useSwitchAnimationLifecycle({
  finishGeneration,
  generationRuntimesRef,
  rootElementRef
}: UseSwitchAnimationLifecycleProps): UseSwitchAnimationLifecycleResult {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia?.(SWITCH_ANIMATION_REDUCED_MOTION_QUERY).matches ?? false
  )
  const finishGenerationRef = useRef(finishGeneration)
  const mountedRef = useRef(true)
  const previousReducedMotionRef = useRef(reducedMotion)

  finishGenerationRef.current = finishGeneration

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const query = window.matchMedia?.(SWITCH_ANIMATION_REDUCED_MOTION_QUERY)

    if (query === undefined) return

    const updateReducedMotion = () => setReducedMotion(query.matches)

    query.addEventListener('change', updateReducedMotion)
    return () => query.removeEventListener('change', updateReducedMotion)
  }, [])

  useLayoutEffect(() => {
    if (reducedMotion && !previousReducedMotionRef.current) {
      const rootElement = rootElementRef.current as HTMLElement

      rootElement.style.transitionDuration = '0ms'

      for (const runtime of generationRuntimesRef.current.values()) {
        runtime.leavingElement.style.opacity = '0'
        runtime.leavingElement.style.transitionDelay = '0ms'
        runtime.leavingElement.style.transitionDuration = '0ms'
        runtime.incomingElement.style.opacity = '1'
        runtime.incomingElement.style.transform = 'none'
        runtime.incomingElement.style.transitionDelay = '0ms'
        runtime.incomingElement.style.transitionDuration = '0ms'
        runtime.pending.clear()
        finishGenerationRef.current(runtime)
      }
    }

    previousReducedMotionRef.current = reducedMotion
  }, [generationRuntimesRef, reducedMotion, rootElementRef])

  const isTransitionPending = useCallback(
    ({
      endValue,
      propertyIndex,
      startValue,
      transitionDelay,
      transitionDuration
    }: SwitchAnimationTransitionEvaluation) => {
      if (startValue.trim() === endValue.trim()) return false

      const delays = transitionDelay.split(',')
      const durations = transitionDuration.split(',')
      const delay = delays[propertyIndex % delays.length] as string
      const duration = durations[propertyIndex % durations.length] as string
      const numericTokens = Array.from(
        `${duration},${delay}`.matchAll(/-?(?:\d+\.?\d*|\.\d+)/g),
        ([token]) => token
      )

      return numericTokens.some((token) => Number(token) !== 0)
    },
    []
  )

  const scheduleGenerationCompletion = useCallback(
    (runtime: SwitchAnimationGenerationRuntime) => {
      queueMicrotask(() => {
        if (
          mountedRef.current &&
          generationRuntimesRef.current.get(runtime.details.replacementId) === runtime
        ) {
          finishGenerationRef.current(runtime)
        }
      })
    },
    [generationRuntimesRef]
  )

  return { isTransitionPending, reducedMotion, scheduleGenerationCompletion }
}
