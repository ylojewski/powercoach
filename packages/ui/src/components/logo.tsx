import { cva, type VariantProps } from 'class-variance-authority'
import type React from 'react'

import LogoSVG from '@/src/assets/logo.svg?react'
import { cn } from '@/src/coss'

export const logoVariants = cva(
  '[&_.power]:fill-amber-500 [&_.plate-left]:fill-amber-500 [&_.extrusion]:fill-black',
  {
    defaultVariants: {
      variant: 'black'
    },
    variants: {
      variant: {
        black: [
          '[&_.coach]:fill-black',
          '[&_.plate-right]:fill-black',
          'dark:[&_.coach]:fill-white',
          'dark:[&_.plate-right]:fill-white'
        ],
        white: [
          '[&_.coach]:fill-white',
          '[&_.plate-right]:fill-white',
          'dark:[&_.coach]:fill-black',
          'dark:[&_.plate-right]:fill-black'
        ]
      }
    }
  }
)

export interface LogoProps
  extends VariantProps<typeof logoVariants>,
    React.SVGProps<SVGSVGElement> {}

export function Logo({ className, variant = 'black', ...props }: LogoProps): React.ReactElement {
  return <LogoSVG className={cn(logoVariants({ variant }), className)} {...props} />
}
