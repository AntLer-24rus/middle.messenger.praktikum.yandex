function getType(obj: unknown) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEqual(a: any, b: any): boolean {
  const type = getType(a)

  if (type !== getType(b)) {
    return false
  }

  if (type === 'object' || type === 'array') {
    if (Object.keys(a).length !== Object.keys(b).length) return false

    for (const key in a) {
      if (Object.prototype.hasOwnProperty.call(a, key)) {
        if (!isEqual(a[key], b[key])) return false
      }
    }
    return true
  }
  if (type === 'function') {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (<Function>(<unknown>a)).name === (<Function>(<unknown>b)).name
  }

  return a === b
}
