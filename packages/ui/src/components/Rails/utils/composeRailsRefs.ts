import { type Ref, type RefCallback } from 'react'

export function composeRailsRefs<TElement>(
  ...refs: (Ref<TElement> | undefined)[]
): RefCallback<TElement> {
  return (element) => {
    const cleanupCallbacks = refs.map((ref) => {
      if (!ref) {
        return undefined
      }

      if (typeof ref === 'function') {
        return ref(element)
      }

      ref.current = element

      return undefined
    })

    return () => {
      for (const [index, ref] of refs.entries()) {
        if (!ref) {
          continue
        }

        if (typeof ref === 'function') {
          const cleanupCallback = cleanupCallbacks[index]

          if (typeof cleanupCallback === 'function') {
            cleanupCallback()
          } else {
            ref(null)
          }
        } else {
          ref.current = null
        }
      }
    }
  }
}
