import { Checkbox } from '@base-ui/react/checkbox'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { AtSign, Check, KeyRound, Link, Search, UserRound } from 'lucide-react'
import { useRef, useState, type ComponentPropsWithRef, type CSSProperties } from 'react'

import { Field, type FieldLabelState, type FieldRootActions } from '../..'

const meta = {
  args: {
    children: null,
    required: false
  },
  argTypes: {
    actionsRef: {
      control: false
    },
    children: {
      control: false
    },
    className: {
      control: 'text'
    },
    render: {
      control: false
    },
    required: {
      control: 'boolean'
    },
    style: {
      control: false
    },
    validate: {
      control: false
    },
    validationMode: {
      control: 'select',
      options: ['onSubmit', 'onBlur', 'onChange']
    }
  },
  component: Field.Root,
  title: 'Components/Field'
} satisfies Meta<typeof Field.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001RequiredFieldWithWaitingGuidance = {
  args: {
    required: true
  },
  name: 'EX-001 - Required Field With Waiting Guidance',
  render: (args) => (
    <Field.Root {...args} className="grid w-100 gap-1" name="email">
      <Field.Label>Email address</Field.Label>
      <Field.Control
        addOn={<AtSign />}
        autoComplete="email"
        placeholder="coach@example.com"
        type="email"
      />
      <Field.Description
        waitingContent="Used for workout notifications."
        waitingKey="email-guidance"
      />
    </Field.Root>
  )
} satisfies Story

export const Ex002OrderedClientValidationErrors = {
  name: 'EX-002 - Ordered Client Validation Errors',
  render: (args) => {
    const actionsRef = useRef<FieldRootActions | null>(null)

    return (
      <Field.Root
        {...args}
        actionsRef={actionsRef}
        className="grid w-100 gap-2"
        name="trainingCode"
        validate={(value) => {
          const code = String(value ?? '')
          const errors: string[] = []

          if (code.length < 8) errors.push('Use at least eight characters.')
          if (!/[A-Z]/.test(code)) errors.push('Add one uppercase letter.')

          return errors.length > 0 ? errors : null
        }}
      >
        <Field.Label>Training code</Field.Label>
        <Field.Control addOn={<KeyRound />} defaultValue="coach" />
        <Field.Description
          getErrorKey={(error, index) => `training-code-${index}-${error}`}
          waitingContent="Use a memorable code with at least eight characters."
          waitingKey="training-code-guidance"
        />
        <button
          className="w-fit border border-foreground bg-background px-3 py-1.5 text-sm text-foreground"
          onClick={() => actionsRef.current?.validate()}
          type="button"
        >
          validate code
        </button>
        <Field.Validity>
          {(state) => (
            <output className="border border-foreground/30 p-2 text-xs text-foreground">
              Current errors: {state.errors.length > 0 ? state.errors.join(' | ') : 'none'}
            </output>
          )}
        </Field.Validity>
      </Field.Root>
    )
  }
} satisfies Story

export const Ex003ForwardInputHeadingAndHintOptions = {
  name: 'EX-003 - Forward Input Heading And Hint Options',
  render: (args) => {
    const [query, setQuery] = useState('tempo')

    return (
      <div className="grid w-100 gap-6">
        <Field.Root {...args} className="grid gap-1" name="search">
          <Field.Label headingProps={{ tone: 'accent' }}>Search</Field.Label>
          <Field.Control
            addOn={<Search />}
            inputAddOnProps={{ 'data-rail': 'search', position: 'end' }}
            inputRootProps={{ 'data-surface': 'search', size: 'md' }}
            onValueChange={setQuery}
            value={query}
          />
          <Field.Description
            stripesOptions={{ angle: '45deg', gap: '6px' }}
            switchAnimationOptions={{
              direction: 'right',
              style: {
                '--switch-animation-duration': '180ms'
              } as CSSProperties
            }}
            textProps={{ className: 'font-medium', size: 'sm' }}
            waitingContent="Search by exercise or equipment."
            waitingKey="search-guidance"
          />
          <output className="text-xs text-muted-foreground">Current search: {query}</output>
        </Field.Root>

        <Field.Root {...args} className="grid gap-1" name="athlete">
          <Field.Label>Athlete</Field.Label>
          <Field.Control addOn={<UserRound />} defaultValue="Yann" />
          <Field.Description
            waitingContent="Use the athlete's display name."
            waitingKey="athlete-guidance"
          />
        </Field.Root>
      </div>
    )
  }
} satisfies Story

export const Ex004ReplacePublicWrapperElements = {
  args: {
    required: true
  },
  name: 'EX-004 - Replace Public Wrapper Elements',
  render: (args) => {
    const [focused, setFocused] = useState(false)

    return (
      <Field.Root {...args} className="grid w-100 gap-1" render={<section data-region="profile" />}>
        <Field.Label
          render={(props: ComponentPropsWithRef<'label'>, state: FieldLabelState) => (
            <label {...props} data-required-probe={state.required ? '' : undefined} />
          )}
        >
          Profile link
        </Field.Label>
        <Field.Control
          addOn={<Link />}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          render={(props, state) => (
            <input {...props} data-focused-probe={state.focused ? '' : undefined} />
          )}
          type="url"
        />
        <Field.Description
          render={(props, state) => (
            <aside {...props} data-field-focused={state.focused ? '' : undefined} />
          )}
          waitingContent="Paste a complete public profile URL."
          waitingKey="profile-link-guidance"
        />
        <output className="text-xs text-muted-foreground">
          Input focus: {focused ? 'inside' : 'outside'}
        </output>
      </Field.Root>
    )
  }
} satisfies Story

export const Ex005PreserveItemAndValidityComposition = {
  name: 'EX-005 - Preserve Item And Validity Composition',
  render: (args) => (
    <Field.Root {...args} className="grid w-100 gap-2" name="trainingConsent">
      <Field.Item className="grid gap-1">
        <Field.Label>
          <Checkbox.Root className="inline-flex size-4 items-center justify-center border border-foreground">
            <Checkbox.Indicator>
              <Check className="size-3" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          I accept the training data policy
        </Field.Label>
        <Field.Description
          waitingContent="You can withdraw consent later."
          waitingKey="consent-guidance"
        />
      </Field.Item>
      <Field.Validity>
        {(state) => (
          <output className="text-xs text-muted-foreground">
            Consent valid: {String(state.validity.valid)}
          </output>
        )}
      </Field.Validity>
    </Field.Root>
  )
} satisfies Story
