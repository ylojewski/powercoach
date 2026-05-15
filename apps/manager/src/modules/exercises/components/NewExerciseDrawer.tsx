import { DrawerDescription, DrawerHeader, DrawerPanel, DrawerTitle } from '@powercoach/ui'
import { type ComponentProps, type PropsWithChildren, type ReactElement } from 'react'

import { ReferencesDrawer } from '@/modules/references'

import { NewExercise } from './NewExercise'

export function NewExerciseDrawer({
  children,
  ...props
}: PropsWithChildren<
  Omit<ComponentProps<typeof ReferencesDrawer>, 'nestedDrawers'>
>): ReactElement {
  return (
    <ReferencesDrawer {...props} nestedDrawers={children}>
      <DrawerHeader>
        <DrawerTitle>New exercise</DrawerTitle>
        <DrawerDescription>Create a new catalog exercise.</DrawerDescription>
      </DrawerHeader>
      <DrawerPanel scrollable={false} className="flex flex-1 flex-col">
        <NewExercise />
      </DrawerPanel>
    </ReferencesDrawer>
  )
}
