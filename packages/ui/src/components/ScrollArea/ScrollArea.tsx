import { ScrollArea as BaseUiScrollArea } from '@base-ui/react/scroll-area'
import { type ReactElement, type ReactNode } from 'react'

import {
  scrollAreaScrollbarVariants,
  scrollAreaThumbVariants
} from './constants/scrollAreaVariants'

export interface ScrollAreaProps extends Omit<BaseUiScrollArea.Root.Props, 'children'> {
  children: ReactNode
}

export function ScrollArea({ children, ...props }: ScrollAreaProps): ReactElement {
  return (
    <BaseUiScrollArea.Root {...props}>
      <BaseUiScrollArea.Viewport className="size-full">
        <BaseUiScrollArea.Content>{children}</BaseUiScrollArea.Content>
      </BaseUiScrollArea.Viewport>
      <BaseUiScrollArea.Scrollbar
        className={scrollAreaScrollbarVariants({ orientation: 'vertical' })}
      >
        <BaseUiScrollArea.Thumb className={scrollAreaThumbVariants({ orientation: 'vertical' })} />
      </BaseUiScrollArea.Scrollbar>
      <BaseUiScrollArea.Scrollbar
        className={scrollAreaScrollbarVariants({ orientation: 'horizontal' })}
        orientation="horizontal"
      >
        <BaseUiScrollArea.Thumb
          className={scrollAreaThumbVariants({ orientation: 'horizontal' })}
        />
      </BaseUiScrollArea.Scrollbar>
      <BaseUiScrollArea.Corner className="bg-transparent" />
    </BaseUiScrollArea.Root>
  )
}
