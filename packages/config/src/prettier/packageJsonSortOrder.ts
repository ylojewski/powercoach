import { type CategorySort } from 'prettier-plugin-sort-json'

const packageJsonSortMap = new Map<RegExp, CategorySort | null>([
  [/^name$/, null],
  [/^version$/, null],
  [/^scripts/, null],
  [/^exports$/, null],
  [/^(d|devD|peerD)ependencies$/, 'lexical'],
  [/^types$/, null],
  [/^style$/, null],
  [/^require$/, null],
  [/^import$/, null],
  [/.*/, 'lexical']
])

export const packageJsonSortOrder = JSON.stringify(Object.fromEntries(packageJsonSortMap))
