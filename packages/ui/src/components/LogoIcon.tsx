import { cva, type VariantProps } from 'class-variance-authority'
import type React from 'react'

import LogoIconSVG from '@/src/assets/logo-icon.svg?react'
import { cn } from '@/src/coss'

export const logoIconVariants = cva('', {
  defaultVariants: {
    variant: 'black'
  },
  variants: {
    variant: {
      black: '[&_.container]:fill-black dark:[&_.container]:fill-white',
      white: '[&_.container]:fill-white dark:[&_.container]:fill-black'
    }
  }
})

export interface LogoIconProps
  extends VariantProps<typeof logoIconVariants>,
    React.SVGProps<SVGSVGElement> {}

export function LogoIcon({
  className,
  variant = 'black',
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
