type StringIndexed = Record<string, unknown>

type PlainObject<T = unknown> = {
  [k in string]: T
}

function getType(obj: unknown) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

function isArray(value: unknown): value is [] {
  return getType(value) === 'array'
}

function isPlainObject(value: unknown): value is PlainObject {
  return getType(value) === 'object'
}

export function queryStringify(data: StringIndexed): string | never {
  if (!isPlainObject(data)) {
    throw new Error('input must be an object')
  }
  const stringifyObject = (obj: PlainObject | []): string[] =>
    Object.entries(obj).flatMap(([idx, val]) => {
      if (isArray(val) || isPlainObject(val)) {
        return stringifyObject(val).map((item) => `[${idx}]${item}`)
      }

      return `[${idx}]=${val}`
    })

  const keyValueArray = Object.entries(data).flatMap(([key, value]) => {
    if (isArray(value) || isPlainObject(value)) {
      return stringifyObject(value).map((item) => `${key}${item}`)
    }
    return `${key}=${value}`
  })

  return keyValueArray.join('&')
}
