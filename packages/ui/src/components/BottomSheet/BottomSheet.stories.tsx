import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useRef, useState, type ReactElement, type ReactNode } from 'react'

import { BottomSheet, Button, type BottomSheetRootChangeEventReason } from '../..'

const meta = {
  args: {
    defaultOpen: false,
    disablePointerDismissal: false
  },
  argTypes: {
    children: {
      control: false
    },
    defaultOpen: {
      control: 'boolean'
    },
    disablePointerDismissal: {
      control: 'boolean'
    },
    onOpenChange: {
      control: false
    },
    onOpenChangeComplete: {
      control: false
    },
    open: {
      control: false
    }
  },
  component: BottomSheet.Root,
  parameters: {
    layout: 'fullscreen'
  },
  title: 'Components/BottomSheet'
} satisfies Meta<typeof BottomSheet.Root>

export default meta

type Story = StoryObj<typeof meta>

function StorySurface({ children }: { children: ReactNode }): ReactElement {
  return (
    <BottomSheet.Surface className="h-dvh">
      <main className="grid size-full place-items-center border border-foreground bg-background p-6 text-foreground">
        {children}
      </main>
    </BottomSheet.Surface>
  )
}

function SheetContent({ children }: { children?: ReactNode }): ReactElement {
  return (
    <div className="grid gap-4">
      {children}
      <div className="h-24 border border-foreground/30 bg-muted" />
    </div>
  )
}

function ControlledBottomSheetStory(): ReactElement {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<BottomSheetRootChangeEventReason>('none')
  const [phase, setPhase] = useState('closed')

  return (
    <StorySurface>
      <div className="grid justify-items-center gap-4">
        <BottomSheet.Root
          disablePointerDismissal
          onOpenChange={(nextOpen, eventDetails) => {
            setReason(eventDetails.reason)
            setOpen(nextOpen)
          }}
          onOpenChangeComplete={(nextOpen) => setPhase(nextOpen ? 'open' : 'closed')}
          open={open}
        >
          <BottomSheet.Trigger render={<Button />}>Open controlled sheet</BottomSheet.Trigger>
          <output aria-live="polite" className="border border-foreground/30 px-3 py-2">
            Last reason: {reason}; phase: {phase}
          </output>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup>
                <BottomSheet.Content>
                  <SheetContent>
                    <BottomSheet.Title className="font-heading text-2xl lowercase">
                      Controlled sheet
                    </BottomSheet.Title>
                    <BottomSheet.Description>
                      Backdrop presses do not dismiss this sheet.
                    </BottomSheet.Description>
                    <output aria-live="polite" className="border border-foreground/30 p-3">
                      Last reason: {reason}; phase: {phase}
                    </output>
                  </SheetContent>
                </BottomSheet.Content>
                <BottomSheet.Close className="mt-6" render={<Button />}>
                  Done
                </BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </div>
    </StorySurface>
  )
}

function ComposedBottomSheetStory(): ReactElement {
  const titleRef = useRef<HTMLHeadingElement>(null)

  return (
    <BottomSheet.Surface aria-label="Workout editor" className="h-dvh" render={<section />}>
      <div className="grid size-full place-items-center border border-foreground bg-background p-6">
        <BottomSheet.Root>
          <BottomSheet.Trigger render={<Button />}>Edit workout</BottomSheet.Trigger>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup initialFocus={titleRef}>
                <BottomSheet.Content>
                  <SheetContent>
                    <BottomSheet.Title
                      ref={titleRef}
                      className="font-heading text-2xl lowercase"
                      tabIndex={-1}
                    >
                      Edit workout
                    </BottomSheet.Title>
                    <BottomSheet.Description>Change the page content.</BottomSheet.Description>
                  </SheetContent>
                </BottomSheet.Content>
                <BottomSheet.Close className="mt-6" render={<Button />}>
                  Save and close
                </BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </div>
    </BottomSheet.Surface>
  )
}

export const Ex001DefaultModalPageSurface = {
  name: 'EX-001 - Default modal page surface',
  render: (args) => (
    <BottomSheet.Surface className="h-dvh">
      <main className="grid size-full place-items-center bg-background p-6 text-foreground">
        <BottomSheet.Root {...args}>
          <BottomSheet.Trigger render={<Button />}>Open workout</BottomSheet.Trigger>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup>
                <BottomSheet.Content>
                  <SheetContent>
                    <BottomSheet.Title className="font-heading text-2xl lowercase">
                      Workout
                    </BottomSheet.Title>
                    <BottomSheet.Description>
                      Review today&apos;s session before starting.
                    </BottomSheet.Description>
                    <p>5 exercises · 45 minutes</p>
                  </SheetContent>
                </BottomSheet.Content>
                <BottomSheet.Close className="mt-6" render={<Button />}>
                  Close workout
                </BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </main>
    </BottomSheet.Surface>
  )
} satisfies Story

export const Ex002ControlledStateAndDismissalReasons = {
  name: 'EX-002 - Controlled state and dismissal reasons',
  render: () => <ControlledBottomSheetStory />
} satisfies Story

export const Ex003FixedPageHeightAndInternalScrolling = {
  name: 'EX-003 - Fixed page height and internal scrolling',
  render: () => (
    <div className="grid min-h-dvh place-items-center bg-muted p-4">
      <BottomSheet.Surface className="h-[36rem] w-full max-w-2xl">
        <div className="grid size-full place-items-center border border-foreground bg-background">
          <BottomSheet.Root>
            <BottomSheet.Trigger render={<Button />}>Browse exercises</BottomSheet.Trigger>
            <BottomSheet.Portal>
              <BottomSheet.Backdrop />
              <BottomSheet.Viewport>
                <BottomSheet.Popup>
                  <BottomSheet.Content>
                    <div className="grid gap-3">
                      <BottomSheet.Title className="font-heading text-2xl lowercase">
                        Exercise library
                      </BottomSheet.Title>
                      <BottomSheet.Description>
                        Select text or scroll through the complete page.
                      </BottomSheet.Description>
                      <label className="grid gap-2">
                        Difficulty
                        <input data-base-ui-swipe-ignore max="5" min="1" type="range" />
                      </label>
                      {Array.from({ length: 24 }, (_, index) => (
                        <p className="border-b border-foreground/30 py-2" key={index}>
                          Exercise {index + 1}
                        </p>
                      ))}
                    </div>
                  </BottomSheet.Content>
                  <BottomSheet.Close className="mt-6" render={<Button />}>
                    Close library
                  </BottomSheet.Close>
                </BottomSheet.Popup>
              </BottomSheet.Viewport>
            </BottomSheet.Portal>
          </BottomSheet.Root>
        </div>
      </BottomSheet.Surface>
    </div>
  )
} satisfies Story

export const Ex004RenderCompositionAndFocusOverrides = {
  name: 'EX-004 - Render composition and focus overrides',
  render: () => <ComposedBottomSheetStory />
} satisfies Story

export const Ex005SharedSurfaceIndentation = {
  name: 'EX-005 - Shared Surface indentation',
  render: () => (
    <StorySurface>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <BottomSheet.Root>
          <BottomSheet.Trigger render={<Button />}>Open filters</BottomSheet.Trigger>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup>
                <BottomSheet.Content>
                  <SheetContent>
                    <BottomSheet.Title className="font-heading text-2xl lowercase">
                      Filters
                    </BottomSheet.Title>
                  </SheetContent>
                </BottomSheet.Content>
                <BottomSheet.Close className="mt-6" render={<Button />}>
                  Close filters
                </BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>

        <BottomSheet.Root>
          <BottomSheet.Trigger render={<Button />}>Open history</BottomSheet.Trigger>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup>
                <BottomSheet.Content>
                  <SheetContent>
                    <BottomSheet.Title className="font-heading text-2xl lowercase">
                      History
                    </BottomSheet.Title>
                  </SheetContent>
                </BottomSheet.Content>
                <BottomSheet.Close className="mt-6" render={<Button />}>
                  Close history
                </BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </div>
    </StorySurface>
  )
} satisfies Story

export const Ex006NestedPageStack = {
  name: 'EX-006 - Nested page stack',
  render: () => (
    <StorySurface>
      <BottomSheet.Root>
        <BottomSheet.Trigger render={<Button />}>Open account</BottomSheet.Trigger>
        <BottomSheet.Portal>
          <BottomSheet.Backdrop />
          <BottomSheet.Viewport>
            <BottomSheet.Popup>
              <BottomSheet.Content>
                <SheetContent>
                  <BottomSheet.Title className="font-heading text-2xl lowercase">
                    Account
                  </BottomSheet.Title>
                  <BottomSheet.Description>Manage your account page.</BottomSheet.Description>
                  <p className="border-s-4 border-foreground ps-3">
                    Open Security settings to see every page retain the same hard shadow while the
                    stack depth changes.
                  </p>

                  <BottomSheet.Root>
                    <BottomSheet.Trigger render={<Button />}>Security settings</BottomSheet.Trigger>
                    <BottomSheet.Portal>
                      <BottomSheet.Backdrop />
                      <BottomSheet.Viewport>
                        <BottomSheet.Popup>
                          <BottomSheet.Content>
                            <SheetContent>
                              <BottomSheet.Title className="font-heading text-2xl lowercase">
                                Security
                              </BottomSheet.Title>
                              <BottomSheet.Description>
                                Review security settings.
                              </BottomSheet.Description>

                              <BottomSheet.Root>
                                <BottomSheet.Trigger render={<Button />}>
                                  Advanced options
                                </BottomSheet.Trigger>
                                <BottomSheet.Portal>
                                  <BottomSheet.Backdrop />
                                  <BottomSheet.Viewport>
                                    <BottomSheet.Popup>
                                      <BottomSheet.Content>
                                        <SheetContent>
                                          <BottomSheet.Title className="font-heading text-2xl lowercase">
                                            Advanced
                                          </BottomSheet.Title>
                                          <BottomSheet.Description>
                                            Manage advanced security options.
                                          </BottomSheet.Description>
                                        </SheetContent>
                                      </BottomSheet.Content>
                                      <BottomSheet.Close className="mt-6" render={<Button />}>
                                        Done
                                      </BottomSheet.Close>
                                    </BottomSheet.Popup>
                                  </BottomSheet.Viewport>
                                </BottomSheet.Portal>
                              </BottomSheet.Root>
                            </SheetContent>
                          </BottomSheet.Content>
                          <BottomSheet.Close className="mt-6" render={<Button />}>
                            Close security
                          </BottomSheet.Close>
                        </BottomSheet.Popup>
                      </BottomSheet.Viewport>
                    </BottomSheet.Portal>
                  </BottomSheet.Root>
                </SheetContent>
              </BottomSheet.Content>
              <BottomSheet.Close className="mt-6" render={<Button />}>
                Close account
              </BottomSheet.Close>
            </BottomSheet.Popup>
          </BottomSheet.Viewport>
        </BottomSheet.Portal>
      </BottomSheet.Root>
    </StorySurface>
  )
} satisfies Story
