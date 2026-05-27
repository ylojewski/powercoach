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
      <DrawerPanel className="flex h-full flex-col" data-base-ui-swipe-ignore="">
        <NewExercise />
      </DrawerPanel>
    </ReferencesDrawer>
  )
}
