import {
  DrawerDescription,
  DrawerHeader,
  DrawerPanel,
  DrawerTitle,
  SwitchAnimation
} from '@powercoach/ui'
import { type ComponentProps, type PropsWithChildren, type ReactElement } from 'react'

import { ReferencesDrawer } from '@/modules/references'

import { NewExercise } from './NewExercise'
import { useExerciseCreation } from '../hooks'
import { CreationMethod } from '../store'

export function NewExerciseDrawer({
  children,
  ...props
}: PropsWithChildren<
  Omit<ComponentProps<typeof ReferencesDrawer>, 'nestedDrawers'>
>): ReactElement {
  const { currentCreation } = useExerciseCreation()
  const title = currentCreation?.exercise.title.toLowerCase()
  const hasExercise = Boolean(currentCreation?.exercise.code)
  const isBlankMethod = !currentCreation || currentCreation?.method === CreationMethod.Blank
  const motionKey = `${isBlankMethod ? 'blank' : 'clone'}-${hasExercise ? 'on' : 'off'}`

  return (
    <ReferencesDrawer {...props} nestedDrawers={children}>
      <DrawerHeader className="relative">
        <DrawerTitle>new exercise</DrawerTitle>
        <SwitchAnimation motionKey={motionKey}>
          {motionKey === 'blank-on' && (
            <DrawerDescription>
              Create a new <span className="font-heading text-sm">{title}</span> catalog exercise
            </DrawerDescription>
          )}
          {motionKey === 'blank-off' && (
            <DrawerDescription>
              Create a new catalog exercise
              <span className="font-heading text-sm text-background" aria-hidden="true">
                placeholder
              </span>
            </DrawerDescription>
          )}
          {motionKey === 'clone-on' && (
            <DrawerDescription>
              Clone <span className="font-heading text-sm">{title}</span> catalog exercise
            </DrawerDescription>
          )}
          {motionKey === 'clone-off' && (
            <DrawerDescription>
              Clone a catalog exercise
              <span className="font-heading text-sm text-background" aria-hidden="true">
                placeholder
              </span>
            </DrawerDescription>
          )}
        </SwitchAnimation>
      </DrawerHeader>
      <DrawerPanel className="flex h-full flex-col" data-base-ui-swipe-ignore="">
        <NewExercise />
      </DrawerPanel>
    </ReferencesDrawer>
  )
}
