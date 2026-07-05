import {
  DirectionProvider as BaseUiDirectionProvider,
  useDirection as useBaseUiDirection
} from '@base-ui/react/direction-provider'
import { Tabs as BaseUiTabs } from '@base-ui/react/tabs'
import { useState, type ReactElement } from 'react'

import { tabsContext } from '../constants/tabsContext'

export type TabsRootOrientation = BaseUiTabs.Root.Orientation

export type TabsRootState = BaseUiTabs.Root.State

export interface TabsRootProps extends Omit<BaseUiTabs.Root.Props, 'dir'> {
  dir?: 'ltr' | 'rtl'
}

export type TabsRootChangeEventReason = BaseUiTabs.Root.ChangeEventReason

export type TabsRootChangeEventDetails = BaseUiTabs.Root.ChangeEventDetails

export function TabsRoot({
  defaultValue,
  dir,
  onValueChange,
  orientation = 'horizontal',
  value,
  ...props
}: TabsRootProps): ReactElement {
  const inheritedDirection = useBaseUiDirection()
  const direction = dir ?? inheritedDirection
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue === undefined ? 0 : defaultValue
  )
  const selectedValue = value === undefined ? uncontrolledValue : value

  return (
    <BaseUiDirectionProvider direction={direction}>
      <tabsContext.Provider value={{ orientation, value: selectedValue }}>
        <BaseUiTabs.Root
          {...props}
          defaultValue={defaultValue}
          dir={direction}
          onValueChange={(nextValue, eventDetails) => {
            onValueChange?.(nextValue, eventDetails)

            if (
              value === undefined &&
              (eventDetails.reason !== 'none' || !eventDetails.isCanceled)
            ) {
              setUncontrolledValue(nextValue)
            }
          }}
          orientation={orientation}
          value={value}
        />
      </tabsContext.Provider>
    </BaseUiDirectionProvider>
  )
}

// Declaration merging exposes the documented Tabs.Root.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TabsRoot {
  export type Orientation = TabsRootOrientation
  export type State = TabsRootState
  export type Props = TabsRootProps
  export type ChangeEventReason = TabsRootChangeEventReason
  export type ChangeEventDetails = TabsRootChangeEventDetails
}
