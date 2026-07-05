import { Field as BaseUiField } from '@base-ui/react/field'
import { type ReactElement } from 'react'

export type FieldValidityProps = BaseUiField.Validity.Props

export type FieldValidityState = BaseUiField.Validity.State

export type FieldValidityData = BaseUiField.ValidityData

export function FieldValidity(props: FieldValidityProps): ReactElement {
  return <BaseUiField.Validity {...props} />
}
