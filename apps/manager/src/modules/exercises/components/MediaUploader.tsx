import { RestrictToHorizontalAxis, RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers'
import { RestrictToElement } from '@dnd-kit/dom/modifiers'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider, useDragOperation } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import {
  AspectRatio,
  Button,
  cn,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  FadeAnimation,
  ScrollArea,
  Separator,
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger
} from '@powercoach/ui'
import Uppy, { type Body, type Meta, type UppyFile } from '@uppy/core'
import {
  UppyContextProvider,
  useDropzone,
  useFileInput,
  useUppyContext,
  useUppyEvent
} from '@uppy/react'
import { CameraIcon, ImagePlusIcon, PlusIcon, XIcon } from 'lucide-react'
import {
  type AnimationEvent,
  type ChangeEvent,
  type ComponentProps,
  type DragEvent as ReactDragEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PropsWithChildren
} from 'react'

export type MediaUploaderOrientation = 'horizontal' | 'vertical'
type MediaUploaderItemStatus = 'entering' | 'idle' | 'removing'
type MediaUploaderDropPlaceholderStatus = 'entering' | 'removing'

interface MediaUploaderItemValue {
  id: string
  image: string
  name: string
  objectUrl?: string
  status: MediaUploaderItemStatus
  uppyFileId?: string
}

interface MediaUploaderDropPlaceholderValue {
  id: number
  index: number
  status: MediaUploaderDropPlaceholderStatus
}

export function MediaUploaderProvider({ children }: PropsWithChildren): ReactElement {
  const reactId = useId()
  const [uppy] = useState(() => {
    return new Uppy({
      id: `media-uploader-${reactId.replace(/\W/g, '')}`,
      restrictions: {
        allowedFileTypes: ['image/*']
      }
    })
  })

  useEffect(() => {
    return () => {
      uppy.destroy()
    }
  }, [uppy])

  return <UppyContextProvider uppy={uppy}>{children}</UppyContextProvider>
}

export interface MediaUploaderProps extends ComponentProps<'div'> {
  orientation?: MediaUploaderOrientation
}

export function MediaUploader({
  className,
  onClick,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onKeyDown,
  orientation = 'vertical',
  ...props
}: MediaUploaderProps): ReactElement {
  const { uppy } = useUppyContext()
  const [items, setItems] = useState<MediaUploaderItemValue[]>([])
  const [dropPlaceholders, setDropPlaceholders] = useState<MediaUploaderDropPlaceholderValue[]>([])
  const [isFileDragActive, setIsFileDragActive] = useState(false)
  const isVertical = orientation === 'vertical'
  const ratio = isVertical ? 16 / 9 : 9 / 16
  const boundsRef = useRef<HTMLDivElement | null>(null)
  const dragDepthRef = useRef(0)
  const itemElementsRef = useRef(new Map<string, Element>())
  const itemsRef = useRef(items)
  const nextDropPlaceholderIdRef = useRef(0)
  const objectUrlsRef = useRef(new Set<string>())
  const pendingInsertionIndexRef = useRef<number | null>(null)
  const dropzone = useDropzone({ noClick: items.length > 0 })
  const dropzoneRootProps = dropzone.getRootProps()
  const dropzoneInputProps = dropzone.getInputProps()

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const cleanupItem = useCallback(
    (item: MediaUploaderItemValue) => {
      if (item.objectUrl && objectUrlsRef.current.delete(item.objectUrl)) {
        URL.revokeObjectURL(item.objectUrl)
      }

      if (item.uppyFileId && uppy.checkIfFileAlreadyExists(item.uppyFileId)) {
        uppy.removeFile(item.uppyFileId)
      }
    },
    [uppy]
  )

  useEffect(
    () => () => {
      itemsRef.current.forEach(cleanupItem)
    },
    [cleanupItem]
  )

  const handleFilesAdded = useCallback((files: UppyFile<Meta, Body>[]) => {
    const nextItems = files.flatMap((file): MediaUploaderItemValue[] => {
      if (!(file.data instanceof Blob)) {
        return []
      }

      const objectUrl = URL.createObjectURL(file.data)
      objectUrlsRef.current.add(objectUrl)

      return [
        {
          id: file.id,
          image: objectUrl,
          name: file.name ?? 'Uploaded image',
          objectUrl,
          status: 'entering',
          uppyFileId: file.id
        }
      ]
    })

    if (!nextItems.length) {
      pendingInsertionIndexRef.current = null
      return
    }

    const pendingInsertionIndex = pendingInsertionIndexRef.current
    pendingInsertionIndexRef.current = null

    setItems((items) => {
      const insertionIndex = Math.max(
        0,
        Math.min(pendingInsertionIndex ?? items.length, items.length)
      )

      return [...items.slice(0, insertionIndex), ...nextItems, ...items.slice(insertionIndex)]
    })
  }, [])

  useUppyEvent(uppy, 'files-added', handleFilesAdded)

  const getInsertionIndex = useCallback(
    (event: ReactDragEvent<HTMLDivElement>): number => {
      if (!items.length) {
        return 0
      }

      const pointerPosition = isVertical ? event.clientY : event.clientX

      for (const [index, item] of items.entries()) {
        const element = itemElementsRef.current.get(item.id)
        const rect = element?.getBoundingClientRect()

        if (!rect) {
          continue
        }

        const itemCenter = isVertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2

        if (pointerPosition < itemCenter) {
          return index
        }
      }

      return items.length
    },
    [isVertical, items]
  )

  const updateDropPlaceholder = useCallback(
    (event: ReactDragEvent<HTMLDivElement>) => {
      const insertionIndex = getInsertionIndex(event)

      pendingInsertionIndexRef.current = insertionIndex
      setIsFileDragActive(true)
      setDropPlaceholders((placeholders) => {
        if (!items.length) {
          return []
        }

        if (
          placeholders.some(
            (placeholder) =>
              placeholder.index === insertionIndex && placeholder.status === 'entering'
          )
        ) {
          return placeholders
        }

        return [
          ...placeholders
            .map((placeholder) =>
              placeholder.status === 'entering'
                ? { ...placeholder, status: 'removing' as const }
                : placeholder
            )
            .filter(
              (placeholder) =>
                placeholder.index !== insertionIndex || placeholder.status !== 'removing'
            ),
          {
            id: nextDropPlaceholderIdRef.current++,
            index: insertionIndex,
            status: 'entering'
          }
        ]
      })
    },
    [getInsertionIndex, items.length]
  )

  const handleRootDragEnter = useCallback(
    (event: ReactDragEvent<HTMLDivElement>) => {
      onDragEnter?.(event)
      dropzoneRootProps.onDragEnter(toDropzoneDragEvent(event))

      if (!hasDraggedFiles(event)) {
        return
      }

      dragDepthRef.current += 1
      updateDropPlaceholder(event)
    },
    [dropzoneRootProps, onDragEnter, updateDropPlaceholder]
  )

  const handleRootDragOver = useCallback(
    (event: ReactDragEvent<HTMLDivElement>) => {
      onDragOver?.(event)
      dropzoneRootProps.onDragOver(toDropzoneDragEvent(event))

      if (hasDraggedFiles(event)) {
        updateDropPlaceholder(event)
      }
    },
    [dropzoneRootProps, onDragOver, updateDropPlaceholder]
  )

  const handleRootDragLeave = useCallback(
    (event: ReactDragEvent<HTMLDivElement>) => {
      onDragLeave?.(event)
      dropzoneRootProps.onDragLeave(toDropzoneDragEvent(event))

      if (!hasDraggedFiles(event)) {
        return
      }

      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

      if (dragDepthRef.current === 0) {
        setDropPlaceholders((placeholders) =>
          placeholders.map((placeholder) =>
            placeholder.status === 'entering' ? { ...placeholder, status: 'removing' } : placeholder
          )
        )
        setIsFileDragActive(false)
      }
    },
    [dropzoneRootProps, onDragLeave]
  )

  const handleRootDrop = useCallback(
    (event: ReactDragEvent<HTMLDivElement>) => {
      onDrop?.(event)

      if (hasDraggedFiles(event)) {
        pendingInsertionIndexRef.current = getInsertionIndex(event)
      }

      dropzoneRootProps.onDrop(toDropzoneDragEvent(event))
      dragDepthRef.current = 0
      setDropPlaceholders([])
      setIsFileDragActive(false)
    },
    [dropzoneRootProps, getInsertionIndex, onDrop]
  )

  const handleRootClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      onClick?.(event)
      dropzoneRootProps.onClick()
    },
    [dropzoneRootProps, onClick]
  )

  const handleRootKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)

      if (items.length > 0 || event.defaultPrevented) {
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        dropzoneRootProps.onClick()
      }
    },
    [dropzoneRootProps, items.length, onKeyDown]
  )

  const handleItemElementChange = useCallback((id: string, element: Element | null) => {
    if (element) {
      itemElementsRef.current.set(id, element)
    } else {
      itemElementsRef.current.delete(id)
    }
  }, [])

  const handleRemove = useCallback((id: string) => {
    setItems((items) =>
      items.map((item) => (item.id === id ? { ...item, status: 'removing' } : item))
    )
  }, [])

  const handleItemAnimationEnd = useCallback(
    (id: string, status: MediaUploaderItemStatus) => {
      if (status === 'entering') {
        setItems((items) =>
          items.map((item) => (item.id === id ? { ...item, status: 'idle' } : item))
        )

        return
      }

      if (status === 'removing') {
        const item = itemsRef.current.find((item) => item.id === id)

        if (item) {
          cleanupItem(item)
        }

        setItems((items) => items.filter((item) => item.id !== id))
      }
    },
    [cleanupItem]
  )

  const handleDropPlaceholderAnimationEnd = useCallback(
    (id: number, status: MediaUploaderDropPlaceholderStatus) => {
      if (status === 'removing') {
        setDropPlaceholders((placeholders) =>
          placeholders.filter((placeholder) => placeholder.id !== id)
        )
      }
    },
    []
  )

  const getDropPlaceholdersAtIndex = useCallback(
    (index: number) =>
      dropPlaceholders.filter((placeholder) => Math.min(placeholder.index, items.length) === index),
    [dropPlaceholders, items.length]
  )

  return (
    <div
      {...props}
      {...dropzoneRootProps}
      aria-label={items.length === 0 ? 'Add gallery images' : undefined}
      className={cn('min-h-0 outline-none', items.length === 0 && 'flex', className)}
      onClick={handleRootClick}
      onDragEnter={handleRootDragEnter}
      onDragLeave={handleRootDragLeave}
      onDragOver={handleRootDragOver}
      onDrop={handleRootDrop}
      onKeyDown={handleRootKeyDown}
      ref={boundsRef}
      role={items.length === 0 ? 'button' : 'presentation'}
      tabIndex={items.length === 0 ? 0 : undefined}
    >
      <input {...dropzoneInputProps} aria-hidden="true" className="hidden" tabIndex={-1} />
      {items.length === 0 ? (
        <ScrollArea>
          <MediaUploaderEmpty isFileDragActive={isFileDragActive} ratio={ratio} />
        </ScrollArea>
      ) : (
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
              {getDropPlaceholdersAtIndex(0).map((placeholder) => (
                <MediaUploaderDropPlaceholder
                  key={placeholder.id}
                  onAnimationEnd={handleDropPlaceholderAnimationEnd}
                  orientation={orientation}
                  placeholder={placeholder}
                />
              ))}
              {items.map((item, index) => (
                <Fragment key={item.id}>
                  {items.length === 1 && item.status === 'removing' ? (
                    <div className="relative">
                      <MediaUploaderEmpty isFileDragActive={isFileDragActive} ratio={ratio} />
                      <MediaUploaderItem
                        item={{ ...item, index }}
                        onAnimationEnd={handleItemAnimationEnd}
                        onElementChange={handleItemElementChange}
                        onRemove={handleRemove}
                        orientation={orientation}
                        ratio={ratio}
                        wrapperClassName="pointer-events-none absolute inset-0 z-10"
                      />
                    </div>
                  ) : (
                    <MediaUploaderItem
                      item={{ ...item, index }}
                      onAnimationEnd={handleItemAnimationEnd}
                      onElementChange={handleItemElementChange}
                      onRemove={handleRemove}
                      orientation={orientation}
                      ratio={ratio}
                    />
                  )}
                  {getDropPlaceholdersAtIndex(index + 1).map((placeholder) => (
                    <MediaUploaderDropPlaceholder
                      key={placeholder.id}
                      onAnimationEnd={handleDropPlaceholderAnimationEnd}
                      orientation={orientation}
                      placeholder={placeholder}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
          </DragDropProvider>
        </ScrollArea>
      )}
    </div>
  )
}

export interface MediaUploaderItemProps
  extends Omit<ComponentProps<typeof AspectRatio>, 'onAnimationEnd' | 'ref'> {
  item: {
    id: string
    image: string
    index: number
    name: string
    status: MediaUploaderItemStatus
  }
  onAnimationEnd: (id: string, status: MediaUploaderItemStatus) => void
  onElementChange: (id: string, element: Element | null) => void
  onRemove: (id: string) => void
  orientation: MediaUploaderOrientation
  wrapperClassName?: string
}

export function MediaUploaderItem({
  item,
  onAnimationEnd,
  onElementChange,
  onRemove,
  orientation,
  wrapperClassName,
  ...props
}: MediaUploaderItemProps): ReactElement {
  const { id, image, index, name, status } = item
  const [element, setElement] = useState<Element | null>(null)
  const handleRef = useRef<HTMLImageElement | null>(null)
  const shadow = 'shadow-[inset_0_0_1px_rgb(0_0_0/.55),0_18px_24px_rgb(34_33_81/.35)]'
  const activeShadow = 'active:shadow-[inset_0_0_1px_rgb(0_0_0/.55),0_18px_24px_rgb(34_33_81/.35)]'
  const { isDragging, isDragSource, isDropping } = useSortable({
    disabled: status === 'removing',
    element,
    handle: handleRef,
    id,
    index
  })
  const { source } = useDragOperation()
  const isVertical = orientation === 'vertical'
  const isDragActive = isDragging || isDragSource || isDropping

  const handleElementChange = useCallback(
    (element: Element | null) => {
      setElement(element)
      onElementChange(id, element)
    },
    [id, onElementChange]
  )

  const handleAnimationEnd = useCallback(
    (event: AnimationEvent<HTMLDivElement>) => {
      if (event.currentTarget === event.target) {
        onAnimationEnd(id, status)
      }
    },
    [id, onAnimationEnd, status]
  )

  return (
    <div
      className={cn(
        'relative grid',
        status === 'idle' ? 'overflow-visible' : 'overflow-hidden',
        isDragActive && 'z-20 overflow-visible',
        isVertical ? '[grid-template-rows:1fr]' : '[grid-template-columns:1fr]',
        status === 'entering' &&
          (isVertical
            ? 'animate-media-uploader-expand-block'
            : 'animate-media-uploader-expand-inline'),
        status === 'removing' &&
          (isVertical
            ? 'animate-media-uploader-collapse-block'
            : 'animate-media-uploader-collapse-inline'),
        wrapperClassName
      )}
      onAnimationEnd={handleAnimationEnd}
      ref={handleElementChange}
    >
      <div
        className={cn(
          'min-h-0 min-w-0',
          status === 'idle' ? 'overflow-visible' : 'overflow-hidden',
          isDragActive && 'overflow-visible'
        )}
      >
        <AspectRatio
          className={cn(
            'shadow-0 relative z-0 cursor-grab touch-none transition-[box-shadow,scale] duration-300 select-none [-webkit-touch-callout:none] [-webkit-user-select:none] active:z-20 active:cursor-grabbing',
            activeShadow,
            status === 'removing' && 'pointer-events-none',
            isDragging && `${shadow} z-20 scale-105`
          )}
          onContextMenu={(event) => {
            event.preventDefault()
          }}
          {...props}
        >
          <img
            alt={name}
            className="touch-none select-none [-webkit-touch-callout:none] [-webkit-user-drag:none] [-webkit-user-select:none]"
            draggable={false}
            ref={handleRef}
            src={image}
          />
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
            <Button
              aria-label={`Remove ${name}`}
              onClick={(event) => {
                event.stopPropagation()
                onRemove(id)
              }}
              size="icon"
              variant="ghost"
            >
              <XIcon className="text-white" strokeWidth={2} />
            </Button>
          </FadeAnimation>
        </AspectRatio>
      </div>
    </div>
  )
}

export interface MediaUploaderDropPlaceholderProps {
  onAnimationEnd: (id: number, status: MediaUploaderDropPlaceholderStatus) => void
  orientation: MediaUploaderOrientation
  placeholder: MediaUploaderDropPlaceholderValue
}

export function MediaUploaderDropPlaceholder({
  onAnimationEnd,
  orientation,
  placeholder
}: MediaUploaderDropPlaceholderProps): ReactElement {
  const isVertical = orientation === 'vertical'
  const { id, status } = placeholder

  return (
    <div
      className={cn(
        'grid shrink-0 overflow-hidden text-muted-foreground bg-background',
        isVertical ? 'grid-rows-[1fr]' : 'grid-cols-[1fr]',
        status === 'entering' &&
          (isVertical
            ? 'animate-media-uploader-expand-block'
            : 'animate-media-uploader-expand-inline'),
        status === 'removing' &&
          (isVertical
            ? 'animate-media-uploader-collapse-block'
            : 'animate-media-uploader-collapse-inline')
      )}
      onAnimationEnd={(event) => {
        if (event.currentTarget === event.target) {
          onAnimationEnd(id, status)
        }
      }}
    >
      <div className="min-h-0 min-w-0 overflow-hidden">
        <div
          className={cn(
            'relative flex items-center',
            isVertical ? 'h-5 w-full' : 'h-full min-h-30 w-5 justify-center'
          )}
        >
          <Separator
            className={cn(
              'absolute bg-border',
              isVertical ? 'top-1/2 left-0 w-full' : 'top-0 left-1/2 h-full'
            )}
            orientation={isVertical ? 'horizontal' : 'vertical'}
          />
          <span
            className={cn(
              'relative z-1 flex items-center text-muted-foreground',
              isVertical ? 'w-8 justify-center bg-background' : 'h-8 justify-center bg-background'
            )}
          >
            <PlusIcon className="size-3.5" />
          </span>
        </div>
      </div>
    </div>
  )
}

export interface MediaUploaderEmptyProps {
  className?: string
  isFileDragActive: boolean
  ratio: number
}

export function MediaUploaderEmpty({
  className,
  isFileDragActive,
  ratio
}: MediaUploaderEmptyProps): ReactElement {
  return (
    <AspectRatio
      className={cn(
        'transition-background my-px grid cursor-pointer place-items-center bg-muted/50 duration-300 hover:bg-muted',
        'before:pointer-events-none before:absolute before:inset-0 before:z-20 before:border-0 before:transition-[border-width,border-color] before:duration-300',
        isFileDragActive && 'before:border-4 before:border-foreground'
      )}
      ratio={ratio}
    >
      <Empty className={cn(isFileDragActive && 'text-primary', 'm-0 gap-2 p-2 md:p-0', className)}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ImagePlusIcon />
          </EmptyMedia>
          <EmptyDescription className="text-xs">
            Drop images here or click to choose them.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </AspectRatio>
  )
}

export function MediaUploaderActions({ className, ...props }: ComponentProps<'div'>): ReactElement {
  const { uppy } = useUppyContext()
  const fileInput = useFileInput()
  const fileInputProps = fileInput.getInputProps()
  const fileButtonProps = fileInput.getButtonProps()
  const cameraInputRef = useRef<HTMLInputElement | null>(null)

  const handleCameraInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.currentTarget.files ?? [])

      if (files.length) {
        uppy.addFiles(
          files.map((file) => ({
            data: file,
            name: file.name,
            type: file.type
          }))
        )
      }

      event.currentTarget.value = ''
    },
    [uppy]
  )

  return (
    <div className={cn('flex', className)} {...props}>
      <input {...fileInputProps} aria-hidden="true" className="hidden" tabIndex={-1} />
      <input
        accept="image/*"
        aria-hidden="true"
        capture="environment"
        className="hidden"
        onChange={handleCameraInputChange}
        ref={cameraInputRef}
        tabIndex={-1}
        type="file"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button {...fileButtonProps} size="icon" variant="ghost">
                <ImagePlusIcon />
              </Button>
            }
          />
          <TooltipPopup sideOffset={8}>Choose an image on your device</TooltipPopup>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                onClick={() => {
                  cameraInputRef.current?.click()
                }}
                size="icon"
                variant="ghost"
              >
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

function hasDraggedFiles(event: ReactDragEvent<HTMLElement>): boolean {
  return Array.from(event.dataTransfer.types).includes('Files')
}

function toDropzoneDragEvent(
  event: ReactDragEvent<HTMLDivElement>
): globalThis.DragEvent & ReactDragEvent<HTMLDivElement> {
  return event as unknown as globalThis.DragEvent & ReactDragEvent<HTMLDivElement>
}
