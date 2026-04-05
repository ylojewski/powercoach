export const RGB_RED = 'rgb(255, 0, 0)' as const
export const RGB_GREEN = 'rgb(0, 255, 0)' as const
export const RGB_BLUE = 'rgb(0, 0, 255)' as const

export function appendStyle(css: string): HTMLStyleElement {
  const style = document.createElement('style')
  style.textContent = css
  document.head.append(style)
  return style
}
