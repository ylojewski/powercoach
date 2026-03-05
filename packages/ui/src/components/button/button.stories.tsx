import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Button } from './button'

const meta = {
  args: {
    children: 'Button'
  },
  argTypes: {
    intent: {
      control: 'select',
      options: ['default']
    },
    size: {
      control: 'select',
      options: ['default']
    }
  },
  component: Button,
  title: 'Components/Button'
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export default meta
