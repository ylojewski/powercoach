import { type RevealAnimationAlignment, type RevealAnimationDirection } from '../RevealAnimation'

export const REVEAL_ANIMATION_HIDDEN_CLIP_PATHS = {
  'bottom-to-top': 'inset(100% 0 0 0)',
  'diagonal-45-to-135':
    'polygon(0 0, 0 0, calc(0px - var(--reveal-height)) 100%, calc(0px - var(--reveal-height)) 100%)',
  'left-to-right': 'inset(0 100% 0 0)',
  'right-to-left': 'inset(0 0 0 100%)',
  'top-to-bottom': 'inset(0 0 100% 0)'
} as const satisfies Record<RevealAnimationDirection, string>

export const REVEAL_ANIMATION_OPPOSITE_HIDDEN_CLIP_PATHS = {
  'bottom-to-top': 'inset(0 0 100% 0)',
  'diagonal-45-to-135':
    'polygon(calc(100% + var(--reveal-height)) 0, calc(100% + var(--reveal-height)) 0, 100% 100%, 100% 100%)',
  'left-to-right': 'inset(0 0 0 100%)',
  'right-to-left': 'inset(0 100% 0 0)',
  'top-to-bottom': 'inset(100% 0 0 0)'
} as const satisfies Record<RevealAnimationDirection, string>

export const REVEAL_ANIMATION_REVEALED_CLIP_PATHS = {
  'bottom-to-top': 'inset(0 0 0 0)',
  'diagonal-45-to-135':
    'polygon(0 0, calc(100% + var(--reveal-height)) 0, 100% 100%, calc(0px - var(--reveal-height)) 100%)',
  'left-to-right': 'inset(0 0 0 0)',
  'right-to-left': 'inset(0 0 0 0)',
  'top-to-bottom': 'inset(0 0 0 0)'
} as const satisfies Record<RevealAnimationDirection, string>

export const REVEAL_ANIMATION_ORIGIN_X = {
  center: 'center',
  end: 'right',
  start: 'left'
} as const satisfies Record<RevealAnimationAlignment, string>

export const REVEAL_ANIMATION_ORIGIN_Y = {
  center: 'center',
  end: 'bottom',
  start: 'top'
} as const satisfies Record<RevealAnimationAlignment, string>
