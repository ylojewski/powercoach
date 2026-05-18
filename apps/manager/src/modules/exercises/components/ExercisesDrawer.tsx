import { DrawerDescription, DrawerHeader, DrawerPanel, DrawerTitle } from '@powercoach/ui'
import { type ComponentProps, type PropsWithChildren, type ReactElement } from 'react'

import { ReferencesDrawer } from '@/modules/references'

import { Exercises } from './Exercises'

export function ExercisesDrawer({
  children,
  ...props
}: PropsWithChildren<
  Omit<ComponentProps<typeof ReferencesDrawer>, 'nestedDrawers'>
>): ReactElement {
  return (
    <ReferencesDrawer {...props} nestedDrawers={children}>
      <DrawerHeader>
        <DrawerTitle>Exercise</DrawerTitle>
        <DrawerDescription>Browse the exercise catalog.</DrawerDescription>
      </DrawerHeader>
      <DrawerPanel className="min-h-full" data-base-ui-swipe-ignore="" scrollable>
        <Exercises />
      </DrawerPanel>
    </ReferencesDrawer>
  )
}
