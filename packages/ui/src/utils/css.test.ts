import { cn } from './css'

describe('css', () => {
  describe('cn', () => {
    it('merges conflicting Tailwind classes', () => {
      expect(cn('p-2 p-4')).toBe('p-4')
    })

    it('merges conflicting Tailwind variants', () => {
      expect(cn('px-2 px-4 py-1 py-3')).toBe('px-4 py-3')
    })

    it('combines clsx behavior with tailwind-merge', () => {
      expect(cn('p-2', { 'text-lg': false, 'text-sm': true }, 'p-4')).toBe('text-sm p-4')
    })
  })
})
