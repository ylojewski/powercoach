export function getInitials(value: string): string {
  let matches = value
    .trim()
    .replace(/@.*/, '')
    .replace(/[`´‘’'ʼ]/g, '')
    .match(/(\p{L}[\p{L}\p{M}]*)/gu)

  if (!matches || matches.length === 0) {
    matches = value
      .trim()
      .replace(/[`´‘’'ʼ]/g, '')
      .match(/(\p{L}[\p{L}\p{M}]*)/gu)
  }

  if (!matches || matches.length === 0) {
    return ''
  }

  if (matches.length === 1) {
    const [initials] = matches[0].match(/^(?:\p{L}\p{M}*){1,2}/u) as RegExpMatchArray
    return initials.toUpperCase()
  }

  const lastMatch = matches[matches.length - 1] as string
  const [firstCharacter] = matches[0].match(/^(?:\p{L}\p{M}*)/u) as RegExpMatchArray
  const [secondCharacter] = lastMatch.match(/^(?:\p{L}\p{M}*)/u) as RegExpMatchArray

  return (firstCharacter + secondCharacter).toUpperCase()
}
