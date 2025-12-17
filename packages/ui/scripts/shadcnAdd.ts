import { spawnSync } from 'node:child_process'
import {
  appendFileSync,
  mkdirSync,
  renameSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { join, parse } from 'node:path'

const SHADCN_DIR = '@/src/components' as const
const COMPONENTS_DIR = 'src/components' as const

const component = process.argv[2] ?? ''
const componentClass = (component[0] ?? '').toUpperCase() + component.slice(1)
const componentDir = join(COMPONENTS_DIR, component)
const componentTestContent = readFileSync('./scripts/component.test.tsx.template', 'utf-8')
  .replaceAll('__COMPONENT__', component)
  .replaceAll('__COMPONENT_CLASS__', componentClass)
const componentStoriesContent = readFileSync('./scripts/component.stories.tsx.template', 'utf-8')
  .replaceAll('__COMPONENT__', component)
  .replaceAll('__COMPONENT_CLASS__', componentClass)

try {
  rmSync(componentDir, { force: true, recursive: true })
  mkdirSync(componentDir, { recursive: true })
  writeFileSync(join(componentDir, `${component}.test.tsx`), componentTestContent, 'utf-8')
  writeFileSync(join(componentDir, `${component}.stories.tsx`), componentStoriesContent, 'utf-8')
  appendFileSync(join(COMPONENTS_DIR, `index.ts`), `\nexport * from './${component}'`, 'utf-8')
} catch (error) {
  console.error(error)
  process.exit(1)
}

spawnSync('shadcn', ['add', '--overwrite', component], {
  stdio: 'inherit'
})

readdirSync(SHADCN_DIR, { withFileTypes: true }).forEach(({ name, parentPath }) => {
  try {
    renameSync(join(parentPath, name), join(componentDir, name))
    appendFileSync(
      join(componentDir, `index.ts`),
      `\nexport * from './${parse(name).name}'`,
      'utf-8'
    )
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})

rmSync('@', { force: true, recursive: true })
