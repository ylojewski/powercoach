import '@testing-library/jest-dom'

class TestResizeObserver implements ResizeObserver {
  private readonly targets = new Set<Element>()

  disconnect(): void {
    this.targets.clear()
  }

  observe(target: Element): void {
    this.targets.add(target)
  }

  unobserve(target: Element): void {
    this.targets.delete(target)
  }
}

globalThis.ResizeObserver = TestResizeObserver

Element.prototype.getAnimations = function getAnimations(): Animation[] {
  return []
}
