import { DrawerPrimitive } from '@powercoach/ui'
import { type ReactElement, type ReactNode } from 'react'

export interface ManagerShellProps {
  children: ReactNode
  drawer?: ReactNode
}

export function ManagerShell({ children, drawer }: ManagerShellProps): ReactElement {
  return (
    <DrawerPrimitive.Provider>
      <DrawerPrimitive.IndentBackground className="bg-background pointer-events-none fixed inset-0 z-0" />
      <DrawerPrimitive.Indent className="bg-background relative z-10 min-h-screen origin-top transition-[border-radius,scale,translate] duration-300 ease-in-out data-active:translate-y-3 data-active:scale-[0.985] data-active:overflow-hidden data-active:rounded-2xl">
        {children}
      </DrawerPrimitive.Indent>
      {drawer}
    </DrawerPrimitive.Provider>
  )
}
