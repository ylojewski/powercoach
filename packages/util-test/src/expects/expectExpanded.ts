export function expectExpanded(element: HTMLElement): void {
  expect(element.getAttribute('aria-expanded')).toBe('true')
}
