export function appendPath(parentPath: string, path?: string): string {
  if (!path) {
    return parentPath
  }

  if (path.startsWith('/')) {
    return path
  }

  return `${parentPath === '/' ? '' : parentPath}/${path}`
}
