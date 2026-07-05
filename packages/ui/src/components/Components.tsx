import { AspectRatio } from './AspectRatio'
import { Autocomplete } from './Autocomplete'
import { Avatar } from './Avatar'
import { AvatarMenu } from './AvatarMenu'
import { BottomSheet } from './BottomSheet'
import { Button } from './Button'
import { Card } from './Card'
import { CardPicker } from './CardPicker'
import { Field } from './Field'
import { Heading } from './Heading'
import { Hint } from './Hint'
import { Input } from './Input'
import { LoadingCover } from './LoadingCover'
import { PopupSurface } from './PopupSurface'
import { Rails } from './Rails'
import { ScrollArea } from './ScrollArea'
import { Stripes } from './Stripes'
import { Tabs } from './Tabs'
import { Text } from './Text'
import { Tiles } from './Tiles'

export * from './AspectRatio'
export * from './Autocomplete'
export * from './Avatar'
export * from './AvatarMenu'
export * from './Button'
export * from './BottomSheet'
export * from './Card'
export * from './CardPicker'
export * from './Field'
export * from './Heading'
export * from './Hint'
export * from './Input'
export * from './LoadingCover'
export * from './PopupSurface'
export * from './Rails'
export * from './ScrollArea'
export * from './Stripes'
export * from './Tabs'
export * from './Text'
export * from './Tiles'

export interface ComponentsNamespace {
  AspectRatio: typeof AspectRatio
  Autocomplete: typeof Autocomplete
  Avatar: typeof Avatar
  AvatarMenu: typeof AvatarMenu
  Button: typeof Button
  BottomSheet: typeof BottomSheet
  Card: typeof Card
  CardPicker: typeof CardPicker
  Field: typeof Field
  Heading: typeof Heading
  Hint: typeof Hint
  Input: typeof Input
  LoadingCover: typeof LoadingCover
  PopupSurface: typeof PopupSurface
  Rails: typeof Rails
  ScrollArea: typeof ScrollArea
  Stripes: typeof Stripes
  Tabs: typeof Tabs
  Text: typeof Text
  Tiles: typeof Tiles
}

export const Components: ComponentsNamespace = {
  AspectRatio,
  Autocomplete,
  Avatar,
  AvatarMenu,
  BottomSheet,
  Button,
  Card,
  CardPicker,
  Field,
  Heading,
  Hint,
  Input,
  LoadingCover,
  PopupSurface,
  Rails,
  ScrollArea,
  Stripes,
  Tabs,
  Text,
  Tiles
}
