import { spawn } from 'node:child_process'
import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { extname } from 'node:path'

import { Spinner as CliSpinner } from 'cli-spinner'

class Spinner {
  private message: string | null = null
  private spinner: CliSpinner | null = null

  constructor(message: string) {
    this.start(message)
  }

  start(message: string): void {
    this.stop()
    this.message = message
    this.spinner = new CliSpinner(message)
    this.spinner.setSpinnerString(['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].join(''))
    this.spinner.start()
  }

  stop(succeed = true) {
    if (this.message && this.spinner) {
      this.spinner.stop(true)
      if (succeed) {
        console.log(`✅ ${this.message}`)
      }
      this.message = null
    }
  }
}

async function createBarrelFiles(directory: string): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true })
  const imports: string[] = []
  const exports: string[] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await createBarrelFiles(`${directory}/${entry.name}`)
      exports.push(`export * from './${entry.name}'`)
      continue
    }
    if (entry.name === 'index.ts') {
      continue
    }
    if (['.ts', '.tsx'].includes(extname(entry.name))) {
      exports.push(`export * from './${entry.name.replace(/\.(ts|tsx)$/, '')}'`)
    }
    if (['.css'].includes(extname(entry.name))) {
      imports.push(`import './${entry.name}'`)
    }
  }

  if (exports.length === 0) {
    exports.push('export {}')
  }

  await writeFile(
    `${directory}/index.ts`,
    [imports.sort().join('\n'), exports.sort().join('\n')].filter(Boolean).join('\n\n')
  )
}

async function deleteGitKeepFiles(directory: string): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await deleteGitKeepFiles(`${directory}/${entry.name}`)
      continue
    }

    if (entry.name === '.gitkeep') {
      await rm(`${directory}/${entry.name}`, { force: true })
    }
  }
}

async function fixImports(directory: string): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await fixImports(`${directory}/${entry.name}`)
      continue
    }
    if (['.ts', '.tsx', '.css'].includes(extname(entry.name))) {
      let content = await readFile(`${directory}/${entry.name}`, 'utf-8')
      content = content
        .replaceAll('@workspace/ui', '@/src/coss')
        .replace('@import "@fontsource-variable/inter";\n', '')
        .replace('@import "geist";\n', '')
        .replace('@source "../../../apps/**/*.{ts,tsx}";\n', '')
        .replace('@source "../../../components/**/*.{ts,tsx}";\n', '')
      await writeFile(`${directory}/${entry.name}`, content, 'utf-8')
    }
  }
}

async function fixEdgeCases(directory: string): Promise<void> {
  // Both Toggle and ToggleGroup have a "Toggle" name export
  let toggleGroupContent = await readFile(`${directory}/components/toggle-group.tsx`, 'utf-8')
  toggleGroupContent = toggleGroupContent.replace('export function Toggle(', 'function Toggle(')
  await writeFile(`${directory}/components/toggle-group.tsx`, toggleGroupContent, 'utf-8')

  // components/button.tsx
  // 85:5  error  Expected object keys to be in insensitive ascending order. 'aria-disabled' should be before 'className'
  let buttonContent = await readFile(`${directory}/components/button.tsx`, 'utf-8')
  buttonContent = buttonContent
    .replace('"aria-disabled": loading || undefined,', '')
    .replace('children: (', '"aria-disabled": loading || undefined,\nchildren: (')
  await writeFile(`${directory}/components/button.tsx`, buttonContent, 'utf-8')

  // components/command.tsx
  // 161:3  error  'className' is defined but never used. Allowed unused args must match /^_/u
  let commandContent = await readFile(`${directory}/components/command.tsx`, 'utf-8')
  commandContent = commandContent.replace(
    /className="relative(.*?)"/,
    'className={`relative$1 ${className}`}'
  )
  await writeFile(`${directory}/components/command.tsx`, commandContent, 'utf-8')

  // components/drawer.tsx
  // 111:3  error  'className' is defined but never used. Allowed unused args must match /^_/u
  let drawerContent = await readFile(`${directory}/components/drawer.tsx`, 'utf-8')
  drawerContent = drawerContent.replace(
    'variant === "inset" && position !== "top" && "pb-(--inset)",',
    'variant === "inset" && position !== "top" && "pb-(--inset)", className'
  )
  await writeFile(`${directory}/components/drawer.tsx`, drawerContent, 'utf-8')

  // hooks/use-media-query.ts
  // 78:55  error  Unexpected empty arrow function  @typescript-eslint/no-empty-function
  let useMediaQueryContent = await readFile(`${directory}/hooks/use-media-query.ts`, 'utf-8')
  useMediaQueryContent = useMediaQueryContent.replace(
    'return () => {};',
    'return () => { return undefined; };'
  )
  await writeFile(`${directory}/hooks/use-media-query.ts`, useMediaQueryContent, 'utf-8')
}

const spinner = new Spinner('Initiating @coss/style')

await rm('./coss', { force: true, recursive: true })

const initCoss = spawn(
  'pnpm',
  'dlx shadcn@latest init @coss/style --name coss --template vite --monorepo'.split(' ')
)

initCoss.on('close', async () => {
  spinner.start('Copying coss files')

  await rm('../src/coss', { force: true, recursive: true })
  await cp('./coss/packages/ui/src', '../src/coss', { recursive: true })

  spinner.start('Deleting .gitkeep files')
  await deleteGitKeepFiles('../src/coss')

  spinner.start('Creating barrel files')
  await createBarrelFiles('../src/coss')

  spinner.start('Fixing imports')
  await fixImports('../src/coss')

  spinner.start('Fixing edge cases')
  await fixEdgeCases('../src/coss')

  spinner.start('Running pre-commit')
  const preCommit = spawn('pnpm', ['pre-commit'])

  preCommit.on('exit', async (code) => {
    if (code !== 0) {
      spinner.stop(false)
      console.log('❌ pre-commit failed (%s)', code)
    }
    spinner.start('Cleaning')
    await rm('./coss', { force: true, recursive: true })
    spinner.stop()
  })
})
