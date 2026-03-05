import { Button as BaseUIButton } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/utils'

export const buttonVariants = cva(
  'flex items-center justify-center h-10 px-3.5 m-0 outline-0 border border-gray-200 rounded-md bg-gray-50 font-inherit text-base font-medium leading-6 text-gray-900 select-none hover:data-[disabled]:bg-gray-50 hover:bg-gray-100 active:data-[disabled]:bg-gray-50 active:bg-gray-200 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] active:border-t-gray-300 active:data-[disabled]:shadow-none active:data-[disabled]:border-t-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800 focus-visible:-outline-offset-1 data-[disabled]:text-gray-500',
  {
    defaultVariants: {
      intent: 'default',
      size: 'default'
    },
    variants: {
      intent: {
        default: ''
      },
      size: {
        default: ''
      }
    }
  }
)

export type ButtonProps = BaseUIButton.Props & VariantProps<typeof buttonVariants>

export function Button({
  children,
  className,
  intent = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <BaseUIButton className={cn(buttonVariants({ className, intent, size }))} {...props}>
      {children}
    </BaseUIButton>
  )
}
