import { cva, type VariantProps } from 'class-variance-authority'
import type React from 'react'

import LogoIconSVG from '@/src/assets/logo-icon.svg?react'
import { cn } from '@/src/coss'

export const logoIconVariants = cva('', {
  defaultVariants: {
    variant: 'foreground'
  },
  variants: {
    variant: {
      background: '[&_.container]:fill-background',
      foreground: '[&_.container]:fill-foreground'
    }
  }
})

export interface LogoIconProps
  extends VariantProps<typeof logoIconVariants>,
    React.SVGProps<SVGSVGElement> {}

export function LogoIcon({
  className,
  variant = 'foreground',
  ...props
}: LogoIconProps): React.ReactElement {
  return (
    <LogoIconSVG
      className={cn(logoIconVariants({ variant }), className)}
      {...props}
      data-testid="logo-icon"
    />
  )
}
