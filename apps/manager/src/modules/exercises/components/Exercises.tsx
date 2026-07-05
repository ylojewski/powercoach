import { Button } from '@powercoach/ui'
import { type ReactElement } from 'react'

import { BackgroundLink, useNavigation } from '@/core'

export function Exercises(): ReactElement {
  const navigation = useNavigation()

  return (
    <Button revealAnimation render={<a type="button" />}>
      New exercise
    </Button>
  )
}
