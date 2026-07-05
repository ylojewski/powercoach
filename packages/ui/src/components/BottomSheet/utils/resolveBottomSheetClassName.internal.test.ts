import { resolveBottomSheetClassName } from './resolveBottomSheetClassName'

describe('resolveBottomSheetClassName', () => {
  it('retains required classes when a state callback returns conflicting classes', () => {
    const className = resolveBottomSheetClassName(
      (state: { open: boolean }) =>
        state.open ? 'box-content w-full overflow-visible consumer-class' : undefined,
      { open: true },
      'box-border w-[calc(100%+2px)] overflow-y-auto'
    )

    expect(className).toContain('box-border')
    expect(className).toContain('w-[calc(100%+2px)]')
    expect(className).toContain('overflow-y-auto')
    expect(className).toContain('box-content')
    expect(className).toContain('w-full')
    expect(className).toContain('overflow-visible')
    expect(className).toContain('consumer-class')
  })
})
