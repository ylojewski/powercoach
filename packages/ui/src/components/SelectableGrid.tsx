import { AlertCircleIcon, ArrowRightSquareIcon, SquareCheckIcon } from 'lucide-react'
import { type CSSProperties, type ReactElement } from 'react'

import { cn } from '../coss'
import { AspectRatio } from './AspectRatio'
import { SwitchAnimation } from './SwitchAnimation'

export interface SelectableGridItem {
  code: string
  description: string
  name: string
}

export interface SelectableGridProps<TItem extends SelectableGridItem> {
  descriptionClassName?: string
  emptyText: string
  gridClassName?: string
  items: TItem[]
  itemsToUrlMap?: Record<string, string>
  onValueChange?: (value: TItem | null) => void
  value: TItem | null
}

export function SelectableGrid<TItem extends SelectableGridItem>({
  descriptionClassName,
  emptyText,
  gridClassName,
  items,
  itemsToUrlMap,
  onValueChange,
  value
}: SelectableGridProps<TItem>): ReactElement {
  return (
    <>
      <div
        className={cn(
          'grid min-h-0 w-full grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-0',
          gridClassName
        )}
        style={{ '--cols': Math.max(items.length, 1) } as CSSProperties}
      >
        {items.map((item) => {
          const active = item === value
          const url = itemsToUrlMap?.[item.code]

          return (
            <button
              aria-label={`Select ${item.name}`}
              aria-pressed={active}
              className="group relative isolate flex min-w-0 cursor-pointer flex-col overflow-hidden bg-background outline-none before:pointer-events-none before:absolute before:inset-0 before:z-1 before:border-y before:border-s before:border-border last:after:pointer-events-none last:after:absolute last:after:inset-y-0 last:after:right-0 last:after:z-1 last:after:w-px last:after:bg-border"
              key={item.code}
              onClick={() => onValueChange?.(active ? null : item)}
              type="button"
            >
              {url && (
                <AspectRatio className="bg-background" fit="contain" ratio={1}>
                  <img alt={item.name} className="scale-75" src={url} />
                </AspectRatio>
              )}
              <span className="bg-accent py-2 pl-3 text-left font-heading text-xs">
                {item.name.toLowerCase()}
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 flex flex-col overflow-hidden bg-foreground transition-[clip-path] duration-300 ease-in-out [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] group-aria-pressed:[clip-path:inset(0_0_0_0)]"
              >
                {url && (
                  <AspectRatio className="bg-background invert" fit="contain" ratio={1}>
                    <img alt={item.name} className="scale-85" src={url} />
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
      <div className={cn('bg-hatched mt-px min-h-12 pe-5', descriptionClassName)}>
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
    </>
  )
}
