import { render, screen } from '@testing-library/react'

import { Autocomplete } from './Autocomplete'

describe('Autocomplete shared popup composition', () => {
  it('preserves Popup and Item render callbacks through PopupSurface', async () => {
    render(
      <Autocomplete.Root items={['Deadlift']} open>
        <Autocomplete.Input aria-label="Exercise" />
        <Autocomplete.Portal keepMounted>
          <Autocomplete.Positioner>
            <Autocomplete.Popup
              render={(props, state) => (
                <section
                  {...props}
                  data-popup-open={state.open ? '' : undefined}
                  data-testid="callback-popup"
                />
              )}
            >
              <Autocomplete.List>
                {(exercise: string) => (
                  <Autocomplete.Item
                    key={exercise}
                    render={(props, state) => (
                      <a
                        {...props}
                        data-item-highlighted={state.highlighted ? '' : undefined}
                        href="exercise"
                      />
                    )}
                    value={exercise}
                  >
                    {exercise}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    )

    expect(await screen.findByTestId('callback-popup')).toHaveAttribute('data-popup-open')
    expect(screen.getByRole('option', { name: 'Deadlift' })).toHaveAttribute('href', 'exercise')
  })
})
