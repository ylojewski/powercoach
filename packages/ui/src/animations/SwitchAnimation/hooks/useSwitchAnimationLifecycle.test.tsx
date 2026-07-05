import { act, renderHook } from '@testing-library/react'
import { type RefObject } from 'react'
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest'

import { useSwitchAnimationLifecycle } from './useSwitchAnimationLifecycle'
import { type SwitchAnimationGenerationRuntime } from '../types/SwitchAnimationTypes'

describe('useSwitchAnimationLifecycle', () => {
  let changeListener: ((event: MediaQueryListEvent) => void) | undefined
  let finishGeneration: Mock<(runtime: SwitchAnimationGenerationRuntime) => void>
  let generationRuntimesRef: RefObject<Map<number, SwitchAnimationGenerationRuntime>>
  let matches: boolean
  let mediaQuery: MediaQueryList
  let removeEventListener: Mock
  let rootElementRef: RefObject<HTMLElement | null>
  let runtime: SwitchAnimationGenerationRuntime

  beforeEach(() => {
    matches = false
    removeEventListener = vi.fn()
    mediaQuery = {
      addEventListener: vi.fn((eventName, listener) => {
        if (eventName === 'change') {
          changeListener = listener as (event: MediaQueryListEvent) => void
        }
      }),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
      get matches() {
        return matches
      },
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      removeEventListener,
      removeListener: vi.fn()
    } as MediaQueryList
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => mediaQuery)
    )

    const incomingElement = document.createElement('div')
    const leavingElement = document.createElement('div')

    runtime = {
      cleanup: new Set(),
      details: {
        direction: 'down',
        nextKey: 'summary',
        previousKey: 'editor',
        replacementId: 1
      },
      incomingElement,
      incomingPresenceId: 1,
      leavingElement,
      leavingPresenceId: 0,
      ownedTransitions: [],
      pending: new Set(['incoming:opacity', 'leaving:opacity']),
      status: 'finished',
      suppressedCancels: new Set()
    }
    generationRuntimesRef = { current: new Map([[1, runtime]]) }
    rootElementRef = { current: document.createElement('div') }
    finishGeneration = vi.fn()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('settles active transition state when reduced motion begins matching', () => {
    const { unmount } = renderHook(() =>
      useSwitchAnimationLifecycle({
        finishGeneration,
        generationRuntimesRef,
        rootElementRef
      })
    )

    act(() => {
      matches = true
      changeListener?.({ matches: true } as MediaQueryListEvent)
    })

    expect(rootElementRef.current).toHaveStyle({ transitionDuration: '0ms' })
    expect(runtime.leavingElement).toHaveStyle({
      opacity: '0',
      transitionDelay: '0ms',
      transitionDuration: '0ms'
    })
    expect(runtime.incomingElement).toHaveStyle({
      opacity: '1',
      transform: 'none',
      transitionDelay: '0ms',
      transitionDuration: '0ms'
    })
    expect(runtime.pending.size).toBe(0)
    expect(finishGeneration).toHaveBeenCalledWith(runtime)

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('suppresses deferred completion for stale generations and after unmount', async () => {
    const { result, unmount } = renderHook(() =>
      useSwitchAnimationLifecycle({
        finishGeneration,
        generationRuntimesRef,
        rootElementRef
      })
    )

    generationRuntimesRef.current.delete(runtime.details.replacementId)
    result.current.scheduleGenerationCompletion(runtime)

    await act(() => Promise.resolve())

    generationRuntimesRef.current.set(runtime.details.replacementId, runtime)
    result.current.scheduleGenerationCompletion(runtime)
    unmount()

    await act(() => Promise.resolve())

    expect(finishGeneration).not.toHaveBeenCalled()
  })

  it('uses no-preference motion when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined)

    const { result } = renderHook(() =>
      useSwitchAnimationLifecycle({
        finishGeneration,
        generationRuntimesRef,
        rootElementRef
      })
    )

    expect(result.current.reducedMotion).toBe(false)
  })

  it('derives pending work from computed timing lists and endpoint values', () => {
    const { result } = renderHook(() =>
      useSwitchAnimationLifecycle({
        finishGeneration,
        generationRuntimesRef,
        rootElementRef
      })
    )

    expect(
      result.current.isTransitionPending({
        endValue: 'matrix(1, 0, 0, 1, 0, 15)',
        propertyIndex: 1,
        startValue: 'matrix(1, 0, 0, 1, 0, 15)',
        transitionDelay: '0ms, 50ms',
        transitionDuration: '200ms'
      })
    ).toBe(false)
    expect(
      result.current.isTransitionPending({
        endValue: '1',
        propertyIndex: 0,
        startValue: '0',
        transitionDelay: '0.0s',
        transitionDuration: 'calc(0ms)'
      })
    ).toBe(false)
    expect(
      result.current.isTransitionPending({
        endValue: 'none',
        propertyIndex: 1,
        startValue: 'matrix(1, 0, 0, 1, 0, -15)',
        transitionDelay: '0ms, 50ms',
        transitionDuration: '0ms, 0ms'
      })
    ).toBe(true)
  })
})
