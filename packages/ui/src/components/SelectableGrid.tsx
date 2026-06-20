import {
  AlertCircleIcon,
  ArrowRightSquareIcon,
  SquareCheckIcon,
  type LucideIcon
} from 'lucide-react'
import { type ComponentProps, type CSSProperties, type ReactElement } from 'react'

import { cn } from '../coss'
import { AspectRatio } from './AspectRatio'
import { SwitchAnimation } from './SwitchAnimation'

export interface SelectableGridItem {
  code: string
  description: string
  name: string
}

export interface SelectableGridProps<TItem extends SelectableGridItem>
  extends ComponentProps<'div'> {
  descriptionClassName?: string
  disabled?: boolean
  allowDeselect?: boolean
  emptyText: string
  gridClassName?: string
  items: TItem[]
  itemsToIconMap?: Record<string, LucideIcon>
  itemsToUrlMap?: Record<string, string>
  layout?: 'horizontal' | 'vertical'
  onValueChange?: (value: TItem | null) => void
  orientation?: 'horizontal' | 'vertical'
  ratio?: number
  ratioClassName?: string
  value: TItem | null
}

export function SelectableGrid<TItem extends SelectableGridItem>({
  allowDeselect = true,
  className,
  descriptionClassName,
  disabled = false,
  emptyText,
  gridClassName,
  items,
  itemsToIconMap,
  itemsToUrlMap,
  layout = 'vertical',
  onValueChange,
  orientation = 'vertical',
  ratio = 1,
  ratioClassName,
  value
}: SelectableGridProps<TItem>): ReactElement {
  const verticalLayout = layout === 'vertical'
  const itemBorderClassName =
    orientation === 'vertical'
      ? 'before:border-x before:border-t last:after:inset-x-0 last:after:bottom-0 last:after:h-px'
      : 'before:border-y before:border-s last:after:inset-y-0 last:after:right-0 last:after:w-px'

  return (
    <div className={cn('flex', verticalLayout ? 'flex-col' : 'flex-row-reverse', className)}>
      <div
        className={cn(
          'grid min-h-0 gap-0',
          verticalLayout ? 'w-full' : 'min-w-0 flex-1',
          orientation === 'vertical'
            ? 'grid-cols-1'
            : 'grid-cols-[repeat(var(--cols),minmax(0,1fr))]',
          gridClassName
        )}
        style={
          {
            '--cols': Math.max(items.length, 1)
          } as CSSProperties
        }
      >
        {items.map((item) => {
          const active = item === value
          const url = itemsToUrlMap?.[item.code]
          const Icon = url ? null : itemsToIconMap?.[item.code]
          const hasMedia = Boolean(url || Icon)
          const selectItem = () => {
            if (!allowDeselect && active) {
              return
            }

            onValueChange?.(active ? null : item)
          }

          return (
            <button
              aria-label={`Select ${item.name}`}
              aria-pressed={active}
              className={cn(
                'group relative isolate flex min-w-0 cursor-pointer flex-col overflow-hidden bg-background outline-none before:pointer-events-none before:absolute before:inset-0 before:z-1 before:border-border last:after:pointer-events-none last:after:absolute last:after:z-1 last:after:bg-border disabled:cursor-not-allowed disabled:opacity-60',
                itemBorderClassName,
                !hasMedia && 'justify-end'
              )}
              disabled={disabled}
              key={item.code}
              onClick={(event) => {
                if (event.detail !== 0) {
                  return
                }

                selectItem()
              }}
              onPointerDown={(event) => {
                if (event.button !== 0) {
                  return
                }

                event.preventDefault()
                event.currentTarget.focus()
                selectItem()
              }}
              type="button"
            >
              {url && (
                <AspectRatio
                  className={cn('bg-background', ratioClassName)}
                  fit="contain"
                  ratio={ratio}
                >
                  <img alt={item.name} className="scale-75" src={url} />
                </AspectRatio>
              )}
              {Icon && (
                <AspectRatio
                  className={cn(
                    'flex items-center justify-center bg-background text-foreground',
                    ratioClassName
                  )}
                  ratio={ratio}
                >
                  <Icon aria-hidden="true" className="size-9" data-slot="selectable-grid-icon" />
                </AspectRatio>
              )}
              <span className="bg-accent py-2 pl-3 text-left font-heading text-xs">
                {item.name.toLowerCase()}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute inset-0 z-10 flex flex-col overflow-hidden bg-foreground transition-[clip-path] duration-300 ease-in-out [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] group-disabled:[clip-path:inset(0_100%_0_0)] group-aria-pressed:[clip-path:inset(0_0_0_0)]',
                  !hasMedia && 'justify-end'
                )}
              >
                {url && (
                  <AspectRatio
                    className={cn('bg-background invert', ratioClassName)}
                    fit="contain"
                    ratio={ratio}
                  >
                    <img alt={item.name} className="scale-85" src={url} />
                  </AspectRatio>
                )}
                {Icon && (
                  <AspectRatio
                    className={cn(
                      'flex items-center justify-center bg-foreground text-background',
                      ratioClassName
                    )}
                    ratio={ratio}
                  >
                    <Icon aria-hidden="true" className="size-10" data-slot="selectable-grid-icon" />
                  </AspectRatio>
                )}
                <span className="flex items-center gap-1 bg-accent py-2 pl-3 text-left font-heading text-xs text-background">
                  <span className="transition-margin -ml-5 w-4 duration-300 group-aria-pressed:ml-0">
                    <SquareCheckIcon
                      className="opacity-0 transition-opacity duration-300 group-aria-pressed:opacity-100"
                      size={14}
                    />
                  </span>
                  {item.name.toLowerCase()}
                </span>
              </span>
            </button>
          )
        })}
      </div>
      <div
        className={cn(
          'bg-hatched min-h-12 pe-5',
          verticalLayout ? 'mt-px' : 'ms-px',
          verticalLayout && orientation === 'vertical' && 'grow',
          descriptionClassName
        )}
      >
        <SwitchAnimation motionKey={value?.code ?? 'unknown'}>
          <span className="flex items-start gap-1 bg-background px-0.5 text-xs text-muted-foreground">
            <span className="ms-1 flex h-lh shrink-0 items-center">
              {value && <ArrowRightSquareIcon size={12} />}
              {!value && <AlertCircleIcon size={12} />}
            </span>
            <span>{value?.description ?? emptyText}</span>
          </span>
        </SwitchAnimation>
      </div>
    </div>
  )
}
