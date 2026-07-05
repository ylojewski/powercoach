import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useLoadingCoverLoadingChange } from './useLoadingCoverLoadingChange'
import { type LoadingCoverVisualState } from '../components/LoadingCoverRoot'

interface LoadingHookProps {
  contentMounted: boolean
  loading: boolean
  visualState: LoadingCoverVisualState
}

describe('useLoadingCoverLoadingChange', () => {
  it('starts true targets while preserving moving content and unmounts only after coverage', () => {
    const setContentMounted = vi.fn()
    const setMembersSettled = vi.fn()
    const setRevealTarget = vi.fn()
    const setVisualState = vi.fn()
    const view = renderHook(
      (props: LoadingHookProps) =>
        useLoadingCoverLoadingChange({
          ...props,
          setContentMounted,
          setMembersSettled,
          setRevealTarget,
          setVisualState
        }),
      {
        initialProps: {
          contentMounted: true,
          loading: false,
          visualState: 'hidden'
        }
      }
    )

    expect(setVisualState).not.toHaveBeenCalled()

    view.rerender({
      contentMounted: true,
      loading: true,
      visualState: 'hidden'
    })

    expect(setMembersSettled).toHaveBeenLastCalledWith(false)
    expect(setRevealTarget).toHaveBeenLastCalledWith(true)
    expect(setVisualState).toHaveBeenLastCalledWith('revealing')
    expect(setContentMounted).not.toHaveBeenCalled()

    view.rerender({
      contentMounted: true,
      loading: true,
      visualState: 'unrevealing'
    })

    expect(setVisualState).toHaveBeenLastCalledWith('revealing')
    expect(setContentMounted).not.toHaveBeenCalled()

    view.rerender({
      contentMounted: true,
      loading: true,
      visualState: 'revealed'
    })

    expect(setContentMounted).toHaveBeenLastCalledWith(false)
    expect(setMembersSettled).toHaveBeenLastCalledWith(false)

    setContentMounted.mockClear()
    setMembersSettled.mockClear()

    view.rerender({
      contentMounted: false,
      loading: true,
      visualState: 'revealed'
    })
    view.rerender({
      contentMounted: true,
      loading: true,
      visualState: 'revealing'
    })

    expect(setContentMounted).not.toHaveBeenCalled()
    expect(setMembersSettled).not.toHaveBeenCalled()
  })
})
