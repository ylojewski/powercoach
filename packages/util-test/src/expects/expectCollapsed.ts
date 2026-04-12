export function expectCollapsed(element: HTMLElement): void {
  expect(element.getAttribute('aria-expanded')).toBe('false')
}
