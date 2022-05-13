export function last<T>(list: T[]): T | undefined {
  if (!Array.isArray(list)) {
    return undefined
  }
  const { length } = list
  return length ? list[length - 1] : undefined
}
