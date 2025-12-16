import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { type StorybookConfig } from '@storybook/react-vite'

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

const config: StorybookConfig = {
  addons: [],
  framework: getAbsolutePath('@storybook/react-vite'),
  stories: ['../lib/**/*.stories.tsx']
}

export default config
