import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { use, useLayoutEffect, useRef, useState, type ReactElement } from 'react'

import { autocompleteContentContext } from '../constants/autocompleteContentContext'
import { useAutocompleteMergedRefs } from '../hooks/useAutocompleteMergedRefs'

export type AutocompletePositionerProps = Omit<BaseUiAutocomplete.Positioner.Props, 'sideOffset'>

export type AutocompletePositionerState = BaseUiAutocomplete.Positioner.State

export function AutocompletePositioner({
  anchor,
  children,
  ref,
  style,
  ...props
}: AutocompletePositionerProps): ReactElement {
  const contentContext = use(autocompleteContentContext)
  const gapElementRef = useRef<HTMLDivElement | null>(null)
  const positionerElementRef = useRef<HTMLDivElement | null>(null)
  const [translation, setTranslation] = useState({ x: 0, y: 0 })
  const composedRef = useAutocompleteMergedRefs(positionerElementRef, ref)
  const inputElementRef = contentContext?.inputElementRef
  const inputGroupElementRef = contentContext?.inputGroupElementRef
  const triggerElementRef = contentContext?.triggerElementRef

  useLayoutEffect(() => {
    const gapElement = gapElementRef.current
    const positionerElement = positionerElementRef.current

    if (gapElement === null || positionerElement === null) {
      return
    }

    let animationFrame = 0
    const resolveAnchor = () => {
      if (anchor !== undefined && anchor !== null) {
        const anchorValue = typeof anchor === 'function' ? anchor() : anchor

        if (anchorValue !== null && typeof anchorValue === 'object' && 'current' in anchorValue) {
          return anchorValue.current
        }

        return anchorValue
      }

      const inputElement = inputElementRef?.current ?? null

      return positionerElement.contains(inputElement)
        ? (triggerElementRef?.current ?? null)
        : (inputGroupElementRef?.current ?? inputElement)
    }
    const syncGap = () => {
      const resolvedAnchor = resolveAnchor()

      if (resolvedAnchor === null || resolvedAnchor === undefined) {
        return
      }

      const side = positionerElement.dataset.side

      if (side === undefined) {
        return
      }

      const anchorRect = resolvedAnchor.getBoundingClientRect()
      const positionerRect = gapElement.getBoundingClientRect()

      if (positionerRect.width === 0 || positionerRect.height === 0) {
        return
      }

      const basePositionerRect = {
        bottom: positionerRect.bottom - translation.y,
        left: positionerRect.left - translation.x,
        right: positionerRect.right - translation.x,
        top: positionerRect.top - translation.y
      }
      const contextElement =
        resolvedAnchor instanceof Element
          ? resolvedAnchor
          : 'contextElement' in resolvedAnchor
            ? resolvedAnchor.contextElement
            : undefined
      const direction =
        (contextElement === undefined ? undefined : getComputedStyle(contextElement).direction) ||
        document.documentElement.dir ||
        'ltr'
      const physicalSide =
        side === 'inline-start'
          ? direction === 'rtl'
            ? 'right'
            : 'left'
          : side === 'inline-end'
            ? direction === 'rtl'
              ? 'left'
              : 'right'
            : side
      const nextTranslation = {
        x:
          physicalSide === 'left'
            ? anchorRect.left - 1 - basePositionerRect.right
            : physicalSide === 'right'
              ? anchorRect.right + 1 - basePositionerRect.left
              : 0,
        y:
          physicalSide === 'top'
            ? anchorRect.top - 1 - basePositionerRect.bottom
            : physicalSide === 'bottom'
              ? anchorRect.bottom + 1 - basePositionerRect.top
              : 0
      }
      const normalizedTranslation = {
        x: Math.round(nextTranslation.x * 1_000_000) / 1_000_000,
        y: Math.round(nextTranslation.y * 1_000_000) / 1_000_000
      }

      if (normalizedTranslation.x !== translation.x || normalizedTranslation.y !== translation.y) {
        setTranslation(normalizedTranslation)
      }
    }
    const syncGapAfterLayout = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(syncGap)
    }
    const resolvedAnchor = resolveAnchor()
    const anchorElement = resolvedAnchor instanceof Element ? resolvedAnchor : undefined
    const mutationObserver = new MutationObserver(syncGap)
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(syncGap)

    syncGap()
    mutationObserver.observe(positionerElement, {
      attributeFilter: ['data-side', 'hidden', 'style'],
      attributes: true
    })
    resizeObserver?.observe(gapElement)

    if (anchorElement !== undefined) {
      anchorElement.addEventListener('focusin', syncGapAfterLayout)
      anchorElement.addEventListener('focusout', syncGapAfterLayout)
      anchorElement.addEventListener('transitioncancel', syncGapAfterLayout)
      anchorElement.addEventListener('transitionend', syncGapAfterLayout)
      resizeObserver?.observe(anchorElement)
    }

    window.addEventListener('resize', syncGapAfterLayout)
    window.addEventListener('scroll', syncGapAfterLayout, true)

    return () => {
      cancelAnimationFrame(animationFrame)
      mutationObserver.disconnect()
      resizeObserver?.disconnect()
      anchorElement?.removeEventListener('focusin', syncGapAfterLayout)
      anchorElement?.removeEventListener('focusout', syncGapAfterLayout)
      anchorElement?.removeEventListener('transitioncancel', syncGapAfterLayout)
      anchorElement?.removeEventListener('transitionend', syncGapAfterLayout)
      window.removeEventListener('resize', syncGapAfterLayout)
      window.removeEventListener('scroll', syncGapAfterLayout, true)
    }
  }, [anchor, inputElementRef, inputGroupElementRef, translation, triggerElementRef])

  return (
    <BaseUiAutocomplete.Positioner
      {...props}
      anchor={anchor}
      ref={composedRef}
      sideOffset={1}
      style={style}
    >
      <div ref={gapElementRef} style={{ translate: `${translation.x}px ${translation.y}px` }}>
        {children}
      </div>
    </BaseUiAutocomplete.Positioner>
  )
}
