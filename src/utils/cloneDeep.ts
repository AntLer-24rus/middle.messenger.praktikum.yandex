import { getType } from './getType'

type PlainObject<T = unknown> = {
  [k in string]: T
}

function isArray(value: unknown): value is [] {
  return getType(value) === 'array'
}

function isPlainObject(value: unknown): value is PlainObject {
  return getType(value) === 'object'
}

export function cloneDeep<T extends object = object>(obj: T): T {
  let clone
  if (isArray(obj)) {
    clone = []
    obj.forEach((item, idx) => {
      clone[idx] = cloneDeep(item)
    })
  } else if (isPlainObject(obj)) {
    clone = {} as PlainObject
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = obj[key]
      }
    }
  } else {
    clone = obj
  }

  return clone as T
}
