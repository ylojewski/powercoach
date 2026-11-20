import { Field as BaseUiField } from '@base-ui/react/field'
import { type ReactElement } from 'react'

export type FieldItemProps = BaseUiField.Item.Props

export type FieldItemState = BaseUiField.Item.State

export function FieldItem(props: FieldItemProps): ReactElement {
  return <BaseUiField.Item {...props} />
}
