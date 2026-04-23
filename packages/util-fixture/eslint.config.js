import { config, buildTypescriptTestConfig } from '@powercoach/config/eslint'

const srcConfig = buildTypescriptTestConfig(['**/*.{ts,tsx}'], './tsconfig.src.json')

export default [...config, srcConfig]
