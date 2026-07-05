import { Field as BaseUiField } from '@base-ui/react/field'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { FieldControl } from './components/FieldControl'
import { FieldLabel } from './components/FieldLabel'
import { FieldRoot, type FieldRootActions } from './components/FieldRoot'

describe('Field implementation', () => {
  it('adapts Root and Label state functions and an element-form Label render', () => {
    const rootStyle = vi.fn(() => ({ color: 'rgb(1, 2, 3)' }))
    const labelClassName = vi.fn(() => 'state-label')
    const labelStyle = vi.fn(() => ({ display: 'block' }))

    render(
      <FieldRoot data-testid="root" style={rootStyle}>
        <FieldLabel
          className={labelClassName}
          headingProps={{ intent: 'destructive' }}
          render={<label data-testid="label" />}
          style={labelStyle}
        >
          Internal field
        </FieldLabel>
        <FieldControl addOn={<svg />} />
      </FieldRoot>
    )

    const root = screen.getByTestId('root')
    const label = screen.getByTestId('label')

    expect(rootStyle).toHaveBeenCalledWith(expect.objectContaining({ required: false }))
    expect(labelClassName).toHaveBeenCalledWith(expect.objectContaining({ required: false }))
    expect(labelStyle).toHaveBeenCalledWith(expect.objectContaining({ required: false }))
    expect(root).toHaveStyle({ color: 'rgb(1, 2, 3)' })
    expect(label).toHaveClass('state-label', 'text-destructive-foreground')
    expect(label).toHaveStyle({ display: 'block' })
  })

  it('keeps standalone Control refs and validates a Root without a generated Control', () => {
    const actionsRef = createRef<FieldRootActions | null>()
    const controlRef = createRef<HTMLElement>()

    render(
      <div>
        <FieldRoot actionsRef={actionsRef} />
        <form data-testid="standalone-form">
          <FieldControl addOn={<svg />} aria-label="Standalone control" ref={controlRef} />
        </form>
      </div>
    )

    const control = screen.getByRole('textbox', { name: 'Standalone control' })

    fireEvent.blur(control)
    fireEvent.keyDown(control, { key: 'Tab' })
    fireEvent.keyDown(control, { key: 'Enter' })
    fireEvent.submit(screen.getByTestId('standalone-form'))
    act(() => actionsRef.current?.validate())

    expect(controlRef.current).toBe(control)
  })

  it('clears only a custom validation message owned by the Field validate result', async () => {
    const actionsRef = createRef<FieldRootActions | null>()
    let validationResult: string | null = 'Field-owned issue'
    const validate = vi.fn(async () => validationResult)

    render(
      <FieldRoot actionsRef={actionsRef} validate={validate}>
        <FieldLabel>Validated field</FieldLabel>
        <FieldControl addOn={<svg />} />
      </FieldRoot>
    )

    const control = screen.getByRole('textbox', { name: 'Validated field' }) as HTMLInputElement

    act(() => actionsRef.current?.validate())
    await waitFor(() => expect(control.validationMessage).toBe('Field-owned issue'))

    control.setCustomValidity('Consumer-owned issue')
    act(() => actionsRef.current?.validate())

    expect(control.validationMessage).toBe('Consumer-owned issue')
    expect(validate).toHaveBeenCalledOnce()

    control.setCustomValidity('')
    act(() => actionsRef.current?.validate())
    await waitFor(() => expect(control.validationMessage).toBe('Field-owned issue'))

    validationResult = null
    act(() => actionsRef.current?.validate())
    await waitFor(() => expect(control.validationMessage).toBe(''))
    expect(validate).toHaveBeenCalledTimes(3)
  })

  it('lets only the latest overlapping async validation claim custom-validity ownership', async () => {
    const actionsRef = createRef<FieldRootActions | null>()
    const validationResolvers: ((result: string | null) => void)[] = []
    const validate = vi.fn(
      () =>
        new Promise<string | null>((resolve) => {
          validationResolvers.push(resolve)
        })
    )

    render(
      <FieldRoot actionsRef={actionsRef} validate={validate}>
        <FieldLabel>Overlapping validation field</FieldLabel>
        <FieldControl addOn={<svg />} />
      </FieldRoot>
    )

    const control = screen.getByRole('textbox', {
      name: 'Overlapping validation field'
    }) as HTMLInputElement

    act(() => actionsRef.current?.validate())
    act(() => actionsRef.current?.validate())
    expect(validate).toHaveBeenCalledTimes(2)

    await act(async () => validationResolvers[1]?.('Latest issue'))
    await waitFor(() => expect(control.validationMessage).toBe('Latest issue'))

    await act(async () => validationResolvers[0]?.('Discarded issue'))
    expect(control.validationMessage).toBe('Latest issue')

    act(() => actionsRef.current?.validate())

    expect(control.validationMessage).toBe('')
    expect(validate).toHaveBeenCalledTimes(3)

    await act(async () => validationResolvers[2]?.(null))
  })

  it('does not claim matching consumer validity after a newer blur validation attempt', async () => {
    const actionsRef = createRef<FieldRootActions | null>()
    let resolveValidation: (result: string | null) => void = () => undefined
    const validate = vi.fn(
      () =>
        new Promise<string | null>((resolve) => {
          resolveValidation = resolve
        })
    )

    render(
      <FieldRoot actionsRef={actionsRef} validate={validate} validationMode="onBlur">
        <FieldLabel>Consumer validity field</FieldLabel>
        <FieldControl addOn={<svg />} />
      </FieldRoot>
    )

    const control = screen.getByRole('textbox', {
      name: 'Consumer validity field'
    }) as HTMLInputElement

    fireEvent.blur(control)
    expect(validate).toHaveBeenCalledOnce()

    control.setCustomValidity('Matching issue')
    fireEvent.blur(control)

    expect(control.validationMessage).toBe('Matching issue')
    expect(validate).toHaveBeenCalledOnce()

    await act(async () => resolveValidation('Matching issue'))
    act(() => actionsRef.current?.validate())

    expect(control.validationMessage).toBe('Matching issue')
    expect(validate).toHaveBeenCalledOnce()
  })

  it('does not claim matching consumer validity during an onChange debounce window', async () => {
    vi.useFakeTimers()

    try {
      const actionsRef = createRef<FieldRootActions | null>()
      let resolveValidation: (result: string | null) => void = () => undefined
      const validate = vi.fn(
        () =>
          new Promise<string | null>((resolve) => {
            resolveValidation = resolve
          })
      )

      render(
        <FieldRoot
          actionsRef={actionsRef}
          validate={validate}
          validationDebounceTime={50}
          validationMode="onChange"
        >
          <FieldLabel>Debounced consumer validity field</FieldLabel>
          <FieldControl addOn={<svg />} />
        </FieldRoot>
      )

      const control = screen.getByRole('textbox', {
        name: 'Debounced consumer validity field'
      }) as HTMLInputElement

      act(() => actionsRef.current?.validate())
      expect(validate).toHaveBeenCalledOnce()

      control.setCustomValidity('Matching issue')
      fireEvent.change(control, { target: { value: 'updated' } })

      expect(validate).toHaveBeenCalledOnce()

      await act(async () => resolveValidation('Matching issue'))
      act(() => actionsRef.current?.validate())

      expect(control.validationMessage).toBe('Matching issue')
      expect(validate).toHaveBeenCalledTimes(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it('reconciles ownership when a non-validating blur does not discard the pending result', async () => {
    const actionsRef = createRef<FieldRootActions | null>()
    const validationResolvers: ((result: string | null) => void)[] = []
    const validate = vi.fn(
      () =>
        new Promise<string | null>((resolve) => {
          validationResolvers.push(resolve)
        })
    )

    render(
      <FieldRoot actionsRef={actionsRef} validate={validate} validationMode="onSubmit">
        <FieldLabel>Reconciled validity field</FieldLabel>
        <FieldControl addOn={<svg />} />
      </FieldRoot>
    )

    const control = screen.getByRole('textbox', {
      name: 'Reconciled validity field'
    }) as HTMLInputElement

    act(() => actionsRef.current?.validate())
    fireEvent.blur(control)
    await act(async () => validationResolvers[0]?.('Field-owned issue'))
    await waitFor(() => expect(control.validationMessage).toBe('Field-owned issue'))

    act(() => actionsRef.current?.validate())

    expect(control.validationMessage).toBe('')
    await act(async () => validationResolvers[1]?.(null))
  })

  it('does not reconcile a stale result after another validation starts resolving', async () => {
    const actionsRef = createRef<FieldRootActions | null>()
    const validationResolvers: ((result: string | null) => void)[] = []
    const validate = vi.fn(
      () =>
        new Promise<string | null>((resolve) => {
          validationResolvers.push(resolve)
        })
    )

    render(
      <FieldRoot actionsRef={actionsRef} validate={validate} validationMode="onSubmit">
        <FieldLabel>Resolution race field</FieldLabel>
        <FieldControl addOn={<svg />} />
      </FieldRoot>
    )

    const control = screen.getByRole('textbox', {
      name: 'Resolution race field'
    }) as HTMLInputElement

    act(() => actionsRef.current?.validate())
    fireEvent.blur(control)

    await act(async () => {
      validationResolvers[0]?.(null)
      await Promise.resolve()
      actionsRef.current?.validate()
    })

    expect(control.validationMessage).toBe('')
    await act(async () => validationResolvers[1]?.(null))
  })

  it('ignores stale ownership tracking when no generated Control is present', async () => {
    const actionsRef = createRef<FieldRootActions | null>()
    let resolveValidation: (result: string | null) => void = () => undefined
    const validate = vi.fn(
      () =>
        new Promise<string | null>((resolve) => {
          resolveValidation = resolve
        })
    )

    render(
      <FieldRoot actionsRef={actionsRef} validate={validate} validationMode="onBlur">
        <BaseUiField.Control aria-label="External control" />
      </FieldRoot>
    )

    const control = screen.getByRole('textbox', { name: 'External control' }) as HTMLInputElement

    fireEvent.blur(control)
    control.setCustomValidity('External issue')
    act(() => actionsRef.current?.validate())
    await act(async () => resolveValidation('External issue'))

    expect(control.validationMessage).toBe('External issue')
  })
})
