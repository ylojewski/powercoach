import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useLoadingCoverDirectionChange } from './useLoadingCoverDirectionChange'
import { type LoadingCoverVisualState } from '../components/LoadingCoverRoot'

interface DirectionHookProps {
  direction: string
  loading: boolean
  revealTarget: boolean
  visualState: LoadingCoverVisualState
}

describe('useLoadingCoverDirectionChange', () => {
  it('recognizes revealed and hidden targets while ignoring unchanged or inapplicable states', () => {
    const setContentMounted = vi.fn()
    const setMembersSettled = vi.fn()
    const setVisualState = vi.fn()
    const view = renderHook(
      (props: DirectionHookProps) =>
        useLoadingCoverDirectionChange({
          ...props,
          setContentMounted,
          setMembersSettled,
          setVisualState
        }),
      {
        initialProps: {
          direction: 'left-to-right',
          loading: false,
          revealTarget: false,
          visualState: 'hidden'
        }
      }
    )

    expect(setVisualState).not.toHaveBeenCalled()

    view.rerender({
      direction: 'top-to-bottom',
      loading: true,
      revealTarget: true,
      visualState: 'revealing'
    })

    expect(setVisualState).toHaveBeenLastCalledWith('revealed')
    expect(setContentMounted).toHaveBeenLastCalledWith(false)
    expect(setMembersSettled).toHaveBeenLastCalledWith(false)

    setContentMounted.mockClear()
    setMembersSettled.mockClear()

    view.rerender({
      direction: 'right-to-left',
      loading: false,
      revealTarget: false,
      visualState: 'hidden'
    })
    view.rerender({
      direction: 'bottom-to-top',
      loading: false,
      revealTarget: true,
      visualState: 'unrevealing'
    })

    expect(setContentMounted).not.toHaveBeenCalled()

    view.rerender({
      direction: 'left-to-right',
      loading: false,
      revealTarget: false,
      visualState: 'unrevealing'
    })

    expect(setContentMounted).toHaveBeenCalledWith(true)
    expect(setMembersSettled).toHaveBeenCalledWith(true)
    expect(setVisualState).toHaveBeenLastCalledWith('hidden')
  })
})
