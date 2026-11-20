import { render, screen } from '@testing-library/react'

import { type InputAddOnProps, InputAddOn } from './InputAddOn'
import { InputControl } from './InputControl'
import { InputRoot } from './InputRoot'

describe('InputAddOn', () => {
  it('discards every excluded interactive prop received from untyped consumers', () => {
    const unsafeProps = {
      accessKey: 'a',
      'aria-describedby': 'unsafe-description',
      autoFocus: true,
      contentEditable: true,
      contextMenu: 'unsafe-menu',
      dangerouslySetInnerHTML: { __html: 'unsafe content' },
      draggable: true,
      onPointerDown: vi.fn(),
      popover: 'auto',
      popoverTarget: 'unsafe-target',
      popoverTargetAction: 'show',
      role: 'button',
      suppressContentEditableWarning: true,
      tabIndex: 0,
      title: 'Unsafe title'
    } as unknown as Omit<InputAddOnProps, 'children'>

    render(
      <InputRoot>
        <InputAddOn {...unsafeProps} data-testid="add-on">
          <svg data-testid="safe-child" />
        </InputAddOn>
        <InputControl aria-label="Value" />
      </InputRoot>
    )

    const addOn = screen.getByTestId('add-on')

    expect(addOn).not.toHaveAttribute('accesskey')
    expect(addOn).not.toHaveAttribute('autofocus')
    expect(addOn).not.toHaveAttribute('contenteditable')
    expect(addOn).not.toHaveAttribute('contextmenu')
    expect(addOn).not.toHaveAttribute('draggable')
    expect(addOn).not.toHaveAttribute('popover')
    expect(addOn).not.toHaveAttribute('popovertarget')
    expect(addOn).not.toHaveAttribute('popovertargetaction')
    expect(addOn).not.toHaveAttribute('role')
    expect(addOn).not.toHaveAttribute('tabindex')
    expect(addOn).not.toHaveAttribute('title')
    expect(addOn).not.toHaveTextContent('unsafe content')
    expect(addOn).toContainElement(screen.getByTestId('safe-child'))
  })
})
