import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/src/coss/lib/utils'

const alertVariants = cva(
  'relative grid w-full items-start gap-x-2 gap-y-0.5 rounded-xl border px-3.5 py-3 text-sm text-card-foreground has-data-[slot=alert-action]:grid-cols-[1fr_auto] has-[>:is(svg,.icon)]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>:is(svg,.icon)]:gap-x-2 has-[>:is(svg,.icon)]:has-data-[slot=alert-action]:grid-cols-[calc(var(--spacing)*4)_1fr_auto] [&>:is(svg,.icon)]:h-lh [&>:is(svg,.icon)]:w-4',
  {
    defaultVariants: {
      variant: 'default'
    },
    variants: {
      variant: {
        default: 'bg-transparent dark:bg-input/32 [&>:is(svg,.icon)]:text-muted-foreground',
        error: 'border-destructive/32 bg-destructive/4 [&>:is(svg,.icon)]:text-destructive',
        info: 'border-info/32 bg-info/4 [&>:is(svg,.icon)]:text-info',
        success: 'border-success/32 bg-success/4 [&>:is(svg,.icon)]:text-success',
        warning: 'border-warning/32 bg-warning/4 [&>:is(svg,.icon)]:text-warning'
      }
    }
  }
)

export type AlertProps = React.ComponentProps<'div'> & VariantProps<typeof alertVariants>

export function Alert({ className, variant, ...props }: AlertProps): React.ReactElement {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  )
}

export function AlertTitle({
  className,
  ...props
}: React.ComponentProps<'div'>): React.ReactElement {
  return (
    <div
      className={cn('font-medium [:is(svg,.icon)~&]:col-start-2', className)}
      data-slot="alert-title"
      {...props}
    />
  )
}

export function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>): React.ReactElement {
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 text-muted-foreground [:is(svg,.icon)~&]:col-start-2',
        className
      )}
      data-slot="alert-description"
      {...props}
    />
  )
}

export function AlertAction({
  className,
  ...props
}: React.ComponentProps<'div'>): React.ReactElement {
  return (
    <div
      className={cn(
        'flex gap-1 max-sm:col-start-2 max-sm:mt-2 sm:row-start-1 sm:row-end-3 sm:self-center sm:[:is(svg,.icon)~&]:col-start-2 sm:[:is(svg,.icon)~[data-slot=alert-description]~&]:col-start-3 sm:[:is(svg,.icon)~[data-slot=alert-title]~&]:col-start-3 sm:[[data-slot=alert-description]~&]:col-start-2 sm:[[data-slot=alert-title]~&]:col-start-2',
        className
      )}
      data-slot="alert-action"
      {...props}
    />
  )
}
