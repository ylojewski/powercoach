import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Button } from './button'

const meta = {
  args: {
    children: 'Button'
  },
  argTypes: {
    asChild: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg']
    },
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link']
    }
  },
  component: Button,
  title: 'Components/Button'
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export default meta
