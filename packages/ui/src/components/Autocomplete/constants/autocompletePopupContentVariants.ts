import { cva } from 'class-variance-authority'

// prettier-ignore
export const autocompletePopupContentVariants = cva(
  `
    flex items-center
  `,
  {
    compoundVariants: [
      {
        className: 'ps-2',
        expandedStart: false,
        size: 'xs',
      },
      {
        className: 'ps-2.5',
        expandedStart: false,
        size: 'md',
      },
      {
        className: 'ps-3',
        expandedStart: false,
        size: 'xl',
      },
      {
        className: 'ps-8',
        expandedStart: true,
        size: 'xs',
      },
      {
        className: 'ps-10.5',
        expandedStart: true,
        size: 'md',
      },
      {
        className: 'ps-12',
        expandedStart: true,
        size: 'xl',
      },
      {
        className: 'pe-8',
        expandedEnd: true,
        size: 'xs'
      },
      {
        className: 'pe-10.5',
        expandedEnd: true,
        size: 'md'
      },
      {
        className: 'pe-12',
        expandedEnd: true,
        size: 'xl'
      },
      {
        className: 'min-h-6 py-1 gap-2',
        kind: 'row',
        size: 'xs'
      },
      {
        className: 'min-h-8 py-1.5 gap-2.5',
        kind: 'row',
        size: 'md'
      },
      {
        className: 'min-h-9 py-2 gap-3',
        kind: 'row',
        size: 'xl'
      },
      {
        className: 'min-h-6 pt-0 pb-0',
        kind: 'groupLabel',
        size: 'xs'
      },
      {
        className: 'min-h-8 pt-1 pb-0',
        kind: 'groupLabel',
        size: 'md'
      },
      {
        className: 'min-h-9 pt-2 pb-0',
        kind: 'groupLabel',
        size: 'xl'
      }
    ],
    defaultVariants: {
      expandedEnd: false,
      expandedStart: false,
      kind: 'row',
      size: 'xl'
    },
    variants: {
      expandedEnd: {
        false: '',
        true: ''
      },
      expandedStart: {
        false: '',
        true: ''
      },
      kind: {
        groupLabel: 'relative',
        row: ''
      },
      size: {
        md: 'pe-2.5',
        xl: 'pe-3',
        xs: 'pe-2'
      }
    }
  }
)
