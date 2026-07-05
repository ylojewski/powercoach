import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useLoadingCoverRegistry } from './useLoadingCoverRegistry'

describe('useLoadingCoverRegistry', () => {
  it('aggregates updates and treats redundant updates and removals as no-ops', () => {
    const member = Symbol('member')
    const view = renderHook(() => useLoadingCoverRegistry())

    expect(view.result.current.everyMemberResolved).toBe(true)
    expect(view.result.current.someMemberActive).toBe(false)

    act(() => view.result.current.registry.setMember(member, false))

    expect(view.result.current.everyMemberResolved).toBe(false)
    expect(view.result.current.someMemberActive).toBe(false)

    act(() => view.result.current.registry.setMember(member, false))
    act(() => view.result.current.registry.setMember(member, true))

    expect(view.result.current.everyMemberResolved).toBe(true)
    expect(view.result.current.someMemberActive).toBe(true)

    act(() => view.result.current.registry.removeMember(member))
    act(() => view.result.current.registry.removeMember(member))

    expect(view.result.current.everyMemberResolved).toBe(true)
    expect(view.result.current.someMemberActive).toBe(false)
  })
})
