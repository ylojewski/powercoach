import { getExerciseCodeFromTitle } from './utils'

describe('getExerciseCodeFromTitle', () => {
  it.each([
    ['Competition squat', 'competition_squat'],
    ['  Paused  Bench-Press  ', 'paused_bench_press'],
    ['Développé couché tempo', 'developpe_couche_tempo'],
    ['///', '']
  ])('converts "%s" to "%s"', (title, code) => {
    expect(getExerciseCodeFromTitle(title)).toBe(code)
  })
})
