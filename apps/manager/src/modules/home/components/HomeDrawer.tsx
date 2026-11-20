import { BottomSheet, Button } from '@powercoach/ui'
import { type ComponentProps, type PropsWithChildren, type ReactElement } from 'react'

export function HomeDrawer({
  children,
  ...props
}: PropsWithChildren<ComponentProps<typeof BottomSheet.Root>>): ReactElement {
  return (
    <BottomSheet.Root {...props}>
      <BottomSheet.Portal>
        <BottomSheet.Backdrop />
        <BottomSheet.Viewport>
          <BottomSheet.Popup>
            <BottomSheet.Content>
              <BottomSheet.Title>Hello drawer</BottomSheet.Title>
              <BottomSheet.Description>
                This drawer is mounted by the home module route.
              </BottomSheet.Description>
              <BottomSheet.Close render={<Button revealAnimation />}>close</BottomSheet.Close>
              <div>Hello world</div>
            </BottomSheet.Content>
          </BottomSheet.Popup>
        </BottomSheet.Viewport>
      </BottomSheet.Portal>
      {children}
    </BottomSheet.Root>
  )
}
