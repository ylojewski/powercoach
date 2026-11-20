import { useLayoutEffect, useState, type RefObject } from 'react'

import { type TilesTheme } from '../types/TilesTypes'

export function useTilesTheme(
  elementRef: RefObject<HTMLElement | null>,
  theme: TilesTheme
): 'dark' | 'light' {
  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>(() => {
    const outsideTheme = document.body.classList.contains('dark') ? 'dark' : 'light'

    return theme === 'inverse' ? (outsideTheme === 'dark' ? 'light' : 'dark') : outsideTheme
  })

  useLayoutEffect(() => {
    const element = elementRef.current as HTMLElement
    const syncEffectiveTheme = () => {
      const outsideBoundary = element.parentElement?.closest<HTMLElement>('.dark, .light')
      const outsideTheme =
        outsideBoundary?.classList.contains('dark') === true
          ? 'dark'
          : outsideBoundary?.classList.contains('light') === true
            ? 'light'
            : document.body.classList.contains('dark')
              ? 'dark'
              : 'light'
      const nextTheme =
        theme === 'inverse' ? (outsideTheme === 'dark' ? 'light' : 'dark') : outsideTheme

      setEffectiveTheme((currentTheme) => (currentTheme === nextTheme ? currentTheme : nextTheme))
    }
    const observer = new MutationObserver(syncEffectiveTheme)
    let ancestor = element.parentElement

    syncEffectiveTheme()

    while (ancestor !== null) {
      observer.observe(ancestor, { attributeFilter: ['class'], attributes: true })
      ancestor = ancestor.parentElement
    }

    return () => observer.disconnect()
  }, [elementRef, theme])

  return effectiveTheme
}
