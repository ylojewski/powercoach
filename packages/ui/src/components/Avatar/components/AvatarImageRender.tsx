import { Avatar as BaseUiAvatar } from '@base-ui/react/avatar'
import { useRender } from '@base-ui/react/use-render'
import { type ComponentPropsWithRef, type ReactElement } from 'react'

export interface AvatarImageRenderProps extends ComponentPropsWithRef<'img'> {
  render?: BaseUiAvatar.Image.Props['render']
  state: BaseUiAvatar.Image.State
}

export function AvatarImageRender({
  render,
  state,
  ...props
}: AvatarImageRenderProps): ReactElement {
  return useRender({
    defaultTagName: 'img',
    props,
    render: render as useRender.RenderProp,
    state: state as unknown as Record<string, unknown>,
    stateAttributesMapping: {
      imageLoadingStatus: () => null,
      transitionStatus: () => null
    }
  }) as ReactElement
}
