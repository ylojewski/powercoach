import { CardButton } from './components/CardButton'
import { CardContent } from './components/CardContent'
import { CardDescription } from './components/CardDescription'
import { CardFooter } from './components/CardFooter'
import { CardGroup } from './components/CardGroup'
import { CardHeader } from './components/CardHeader'
import { CardRoot } from './components/CardRoot'
import { CardSelector } from './components/CardSelector'
import { CardSurface } from './components/CardSurface'
import { CardTitle } from './components/CardTitle'
import { CardVisual } from './components/CardVisual'

export * from './components/CardButton'
export * from './components/CardContent'
export * from './components/CardDescription'
export * from './components/CardFooter'
export * from './components/CardGroup'
export * from './components/CardHeader'
export * from './components/CardRoot'
export * from './components/CardSelector'
export * from './components/CardSurface'
export * from './components/CardTitle'
export * from './components/CardVisual'
export * from './types/CardTypes'

export interface CardNamespace {
  Button: typeof CardButton
  Content: typeof CardContent
  Description: typeof CardDescription
  Footer: typeof CardFooter
  Group: typeof CardGroup
  Header: typeof CardHeader
  Root: typeof CardRoot
  Selector: typeof CardSelector
  Surface: typeof CardSurface
  Title: typeof CardTitle
  Visual: typeof CardVisual
}

export const Card: CardNamespace = {
  Button: CardButton,
  Content: CardContent,
  Description: CardDescription,
  Footer: CardFooter,
  Group: CardGroup,
  Header: CardHeader,
  Root: CardRoot,
  Selector: CardSelector,
  Surface: CardSurface,
  Title: CardTitle,
  Visual: CardVisual
}
