import { config, buildTypescriptTestConfig } from '@powercoach/config/eslint'

export default [...config, buildTypescriptTestConfig(['**/*.{ts,tsx}'], ['./tsconfig.src.json'])]
