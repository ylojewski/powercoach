import { type StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.tsx'],
  viteFinal: async (viteConfig) =>
    mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
      server: {
        allowedHosts: ['7c84-2a01-cb18-809e-c200-d834-dc42-6823-aca8.ngrok-free.app']
      }
    })
}

export default config
