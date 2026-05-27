import { RestrictToHorizontalAxis, RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers'
import { RestrictToElement } from '@dnd-kit/dom/modifiers'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider, useDragOperation } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import {
  AspectRatio,
  Button,
  cn,
  FadeAnimation,
  ScrollArea,
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger
} from '@powercoach/ui'
import { CameraIcon, ImagePlusIcon, XIcon } from 'lucide-react'
import { type ComponentProps, type ReactElement, useRef, useState } from 'react'

import media1 from './media1.jpeg'
import media2 from './media2.jpeg'
import media3 from './media3.jpeg'

export type MediaUploaderOrientation = 'horizontal' | 'vertical'

export interface MediaUploaderProps extends ComponentProps<'div'> {
  orientation?: MediaUploaderOrientation
}

export function MediaUploader({
  orientation = 'vertical',
  ...props
}: MediaUploaderProps): ReactElement {
  const [items, setItems] = useState([
    { id: 1, image: media1 },
    { id: 2, image: media2 },
    { id: 3, image: media3 }
  ])
  const isVertical = orientation === 'vertical'
  const ratio = isVertical ? 16 / 9 : 9 / 16
  const boundsRef = useRef<HTMLDivElement | null>(null)

  return (
    <div ref={boundsRef} {...props}>
      <ScrollArea>
        <DragDropProvider<typeof items>
          modifiers={[
            isVertical ? RestrictToVerticalAxis : RestrictToHorizontalAxis,
            RestrictToElement.configure({ element: () => boundsRef.current })
          ]}
          onDragOver={(event) => {
            setItems((items) => move(items, event))
          }}
          onDragEnd={(event) => {
            setItems((items) => move(items, event))
          }}
        >
          <div className={cn('flex gap-px', isVertical && 'flex-col')}>
            {items.map((item, index) => (
              <MediaUploaderItem item={{ ...item, index }} key={item.id} ratio={ratio} />
            ))}
          </div>
        </DragDropProvider>
      </ScrollArea>
    </div>
  )
}

export interface MediaUploaderItemProps extends ComponentProps<typeof AspectRatio> {
  item: {
    id: number
    image: string
    index: number
  }
}

export function MediaUploaderItem({
  item,
  ...props
}: MediaUploaderItemProps): ReactElement {
  const { id, image, index } = item
  const [element, setElement] = useState<Element | null>(null)
  const handleRef = useRef<HTMLImageElement | null>(null)
  const shadow = 'shadow-[inset_0_0_1px_rgb(0_0_0/.55),0_18px_24px_rgb(34_33_81/.35)]'
  const { isDragging } = useSortable({ element, handle: handleRef, id, index })
  const { source } = useDragOperation()

  return (
    <AspectRatio
      ref={setElement}
      className={cn(
        `shadow-0 relative cursor-grab transition-shadow duration-300 active:cursor-grabbing active:${shadow}`,
        isDragging && shadow
      )}
      {...props}
    >
      <img src={image} alt={image} ref={handleRef} />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-8 bg-foreground/75 pb-2"></div>
      <div className="pointer-events-none absolute bottom-1 left-0 z-11 flex w-full items-baseline">
        <div className="mr-1 flex w-8 justify-center font-heading text-3xl text-background">
          {index + 1}
        </div>
        <FadeAnimation
          className="text-xs text-white text-shadow-foreground/30 text-shadow-lg"
          show={index === 0 && !source}
        >
          <span>Main image</span>
        </FadeAnimation>
      </div>
      <FadeAnimation className="absolute top-px z-11" show={!source}>
        <Button size="icon" variant="ghost">
          <XIcon
            className="text-white"
            strokeWidth={2}
          />
        </Button>
      </FadeAnimation>
    </AspectRatio>
  )
}

export function MediaUploaderActions({ className, ...props }: ComponentProps<'div'>): ReactElement {
  return (
    <div className={cn('flex', className)} {...props}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button size="icon" variant="ghost">
                <ImagePlusIcon />
              </Button>
            }
          />
          <TooltipPopup sideOffset={8}>Chose an image on your device</TooltipPopup>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button size="icon" variant="ghost">
                <CameraIcon />
              </Button>
            }
          />
          <TooltipPopup sideOffset={8}>Take an image with your camera</TooltipPopup>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
