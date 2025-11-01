import {
  config as sharedConfig,
  createTestConfig,
  createTypescriptConfig,
  testConfig as sharedTestConfig,
  typescriptConfig as sharedTypescriptConfig
} from '@powercoach/config/eslint'

const apiTypescriptConfig = createTypescriptConfig('./tsconfig.src.json')
const apiTestConfig = createTestConfig('./tsconfig.test.json')

const apiConfig = [...sharedConfig]
const typescriptConfigIndex = apiConfig.indexOf(sharedTypescriptConfig)

if (typescriptConfigIndex !== -1) {
  apiConfig.splice(typescriptConfigIndex, 1, apiTypescriptConfig)
} else {
  apiConfig.push(apiTypescriptConfig)
}

if (!apiConfig.includes(sharedTestConfig)) {
  apiConfig.push(apiTestConfig)
} else {
  const testConfigIndex = apiConfig.indexOf(sharedTestConfig)
  apiConfig.splice(testConfigIndex, 1, apiTestConfig)
}

export default apiConfig
