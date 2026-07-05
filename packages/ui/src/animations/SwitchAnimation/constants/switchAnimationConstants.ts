import {
  type SwitchAnimationDirection,
  type SwitchAnimationStyle
} from '../types/SwitchAnimationTypes'

export const SWITCH_ANIMATION_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)' as const

export const SWITCH_ANIMATION_RENDER_STATE = {} as const satisfies Record<string, never>

export const SWITCH_ANIMATION_FALLBACK_MOTION_STYLE = {
  '--switch-animation-distance': '15px',
  '--switch-animation-duration': '200ms',
  '--switch-animation-easing': 'ease-in-out',
  '--switch-animation-stagger': '50ms'
} as const satisfies SwitchAnimationStyle

export const SWITCH_ANIMATION_REDUCED_MOTION_STYLE = {
  '--switch-animation-distance': '0px',
  '--switch-animation-duration': '0ms',
  '--switch-animation-stagger': '0ms'
} as const satisfies SwitchAnimationStyle

export function getSwitchAnimationTransforms(
  direction: SwitchAnimationDirection,
  distance: string
) {
  const axis = direction === 'down' || direction === 'up' ? 'Y' : 'X'
  const positiveTransform = `translate${axis}(${distance})`
  const negativeTransform = `translate${axis}(calc(-1 * ${distance}))`
  const entersFromNegative = direction === 'down' || direction === 'right'

  return {
    entering: entersFromNegative ? negativeTransform : positiveTransform,
    leaving: entersFromNegative ? positiveTransform : negativeTransform
  }
}

export function getSwitchAnimationPixelSum(...values: string[]) {
  return values.reduce((sum, value) => {
    const parsedValue = Number.parseFloat(value)

    return sum + (Number.isFinite(parsedValue) ? parsedValue : 0)
  }, 0)
}
