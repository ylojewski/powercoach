import { Field } from '@base-ui/react/field'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { ALargeSmall, AtSign, Hash, MessageSquareText, Search, UserRound } from 'lucide-react'
import { useState } from 'react'

import { Input } from '../..'

const meta = {
  args: {
    children: null,
    size: 'xl'
  },
  argTypes: {
    children: {
      control: false
    },
    className: {
      control: 'text'
    },
    size: {
      control: 'select',
      options: ['xs', 'md', 'xl']
    },
    style: {
      control: false
    }
  },
  component: Input.Root,
  title: 'Components/Input'
} satisfies Meta<typeof Input.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001DefaultXlInputWithPlaceholder = {
  name: 'EX-001 - Default xl Input With Placeholder',
  render: (args) => (
    <label className="grid max-w-xl gap-1 font-sans text-sm text-foreground">
      Workout name
      <Input.Root {...args}>
        <Input.AddOn>
          <ALargeSmall />
        </Input.AddOn>
        <Input.Control placeholder="Some placeholder" />
      </Input.Root>
    </label>
  )
} satisfies Story

export const Ex002ControlledValueAndLogicalEndAddOn = {
  name: 'EX-002 - Controlled Value And Logical-end AddOn',
  render: (args) => {
    const [query, setQuery] = useState('Some value')

    return (
      <div className="grid max-w-xl gap-4 font-sans text-sm text-foreground">
        <label className="grid gap-1">
          Search
          <Input.Root {...args}>
            <Input.AddOn position="end">
              <Search />
            </Input.AddOn>
            <Input.Control value={query} onValueChange={setQuery} />
          </Input.Root>
        </label>

        <label className="grid gap-1">
          Athlete
          <Input.Root {...args}>
            <Input.AddOn>
              <UserRound />
            </Input.AddOn>
            <Input.Control defaultValue="Yann" />
          </Input.Root>
        </label>

        <output className="border border-foreground/30 p-2 text-xs">
          Controlled value: {query}
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex003ProportionalInputSizes = {
  name: 'EX-003 - Proportional Input Sizes',
  render: () => (
    <div className="grid max-w-xl gap-3 text-foreground">
      <Input.Root size="xs">
        <Input.AddOn>
          <Hash />
        </Input.AddOn>
        <Input.Control aria-label="Extra-small code" placeholder="xs" />
      </Input.Root>

      <Input.Root size="md">
        <Input.AddOn>
          <Hash />
        </Input.AddOn>
        <Input.Control aria-label="Medium code" placeholder="md" />
      </Input.Root>

      <Input.Root size="xl">
        <Input.AddOn>
          <Hash />
        </Input.AddOn>
        <Input.Control aria-label="Extra-large code" placeholder="xl" />
      </Input.Root>
    </div>
  )
} satisfies Story

export const Ex004BaseUiFieldIntegration = {
  name: 'EX-004 - Base UI Field Integration',
  render: (args) => {
    const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

    return (
      <form
        className="grid max-w-xl gap-3 font-sans text-sm text-foreground"
        onSubmit={(event) => {
          event.preventDefault()

          const formData = new FormData(event.currentTarget)

          setSubmittedEmail(String(formData.get('email') ?? ''))
        }}
      >
        <Field.Root className="grid gap-1" name="email">
          <Field.Label>Email</Field.Label>
          <Input.Root {...args} size="md">
            <Input.AddOn>
              <AtSign />
            </Input.AddOn>
            <Input.Control type="email" required placeholder="coach@example.com" />
          </Input.Root>
          <Field.Description className="text-xs text-muted-foreground">
            Used for workout notifications.
          </Field.Description>
          <Field.Error className="text-xs text-foreground" />
        </Field.Root>

        <button
          className="w-fit border border-foreground bg-background px-3 py-1.5 text-foreground"
          type="submit"
        >
          Submit email
        </button>

        <dl className="grid gap-1 border border-foreground/30 p-2 text-xs">
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <dt className="text-muted-foreground">submitted name</dt>
            <dd>email</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <dt className="text-muted-foreground">submitted value</dt>
            <dd>{submittedEmail ?? 'No submission yet.'}</dd>
          </div>
        </dl>
      </form>
    )
  }
} satisfies Story

export const Ex005SharedFieldEmphasisUtility = {
  name: 'EX-005 - Shared field-emphasis Utility',
  render: () => (
    <div className="grid max-w-xl gap-3 font-sans text-sm text-foreground">
      <label className="grid gap-1">
        Notes
        <div
          className={
            // prettier-ignore
            `
              field-emphasis flex min-w-0
              border border-foreground/30 bg-background text-foreground
              [--field-emphasis-offset:--spacing(0.5)] [--field-emphasis-shadow-offset:--spacing(1)]
            `
          }
        >
          <span
            aria-hidden="true"
            className={
              // prettier-ignore
              `
                pointer-events-none flex w-9 shrink-0 items-center justify-center
                border-e border-foreground/30 bg-muted text-muted-foreground
                [&_svg]:size-4 [&_svg]:shrink-0
              `
            }
            data-field-addon
            inert
          >
            <MessageSquareText />
          </span>
          <textarea
            className={
              // prettier-ignore
              `
                min-w-0 flex-1 resize-none bg-transparent px-3
                text-base/5 text-foreground placeholder:text-foreground/50
                outline-none
              `
            }
          />
        </div>
      </label>

      <dl className="grid gap-1 border border-foreground/30 p-2 text-xs">
        <div className="grid grid-cols-[8rem_1fr] gap-2">
          <dt className="text-muted-foreground">focus trigger</dt>
          <dd>focus within</dd>
        </div>
        <div className="grid grid-cols-[8rem_1fr] gap-2">
          <dt className="text-muted-foreground">reduced motion</dt>
          <dd>duration 0, final state preserved</dd>
        </div>
      </dl>
    </div>
  )
} satisfies Story

export const Ex006SharedHardShadowAndConsumerOverride = {
  name: 'EX-006 - Shared hard shadow and consumer override',
  render: () => (
    <div className="grid max-w-xl gap-4 font-sans text-sm text-foreground">
      <div className="border border-foreground bg-background p-4 shadow-(--hard-shadow)">
        shared hard shadow
      </div>
      <div className="border border-foreground bg-background p-4 shadow-(--hard-shadow) shadow-none">
        consumer-owned shadow override
      </div>
    </div>
  )
} satisfies Story
