export function getType(obj: unknown) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}
