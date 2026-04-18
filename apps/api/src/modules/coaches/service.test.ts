import { getCoachEmailHeader } from './service'

describe('getCoachEmailHeader', () => {
  it('returns the trimmed email when the header is provided as a string', () => {
    expect(getCoachEmailHeader(' astra.quill@example.test ')).toBe('astra.quill@example.test')
  })

  it('returns null when the header is empty', () => {
    expect(getCoachEmailHeader('   ')).toBeNull()
  })

  it('returns null when the header is missing', () => {
    expect(getCoachEmailHeader(undefined)).toBeNull()
  })

  it('returns null when the provided header is not a string', () => {
    expect(getCoachEmailHeader(['astra.quill@example.test'])).toBeNull()
  })
})
