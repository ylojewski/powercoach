import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Button } from './Button'

const meta = {
  component: Button,
  title: 'Components/Button'
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export default meta
