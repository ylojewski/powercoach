import { mergeProps } from '@base-ui/react/merge-props'
import { type ComponentPropsWithRef, type ReactElement, type ReactNode } from 'react'

import { inputRootVariants } from '../constants/inputRootVariants'
import { inputSizeContext } from '../constants/inputSizeContext'
import { type InputSize } from '../types/InputTypes'

export interface InputRootProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  children: ReactNode
  size?: InputSize
}

export function InputRoot({ children, ref, size = 'xl', ...props }: InputRootProps): ReactElement {
  return (
    <inputSizeContext.Provider value={size}>
      <div
        {...mergeProps<'div'>(props, {
          className: inputRootVariants({ size })
        })}
        data-size={size}
        ref={ref}
      >
        {children}
      </div>
    </inputSizeContext.Provider>
  )
}
