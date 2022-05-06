export function first<T>(list: T[]): T | undefined {
  if (!Array.isArray(list)) {
    return undefined
  }
  return list[0]
}
