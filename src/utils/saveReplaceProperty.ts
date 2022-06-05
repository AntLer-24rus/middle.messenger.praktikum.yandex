/* eslint no-param-reassign: ["error", { "props": false }] */
export function saveReplaceProperty<
  O extends Record<string, unknown>,
  R extends Record<string, unknown>
>(obj: O, replacer: R) {
  const origValue: O = {} as never
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const replacerValue = replacer[key] as unknown
      if (replacerValue) {
        origValue[key] = obj[key]
        obj[key] = replacerValue as never
      }
    }
  }
  return () => {
    for (const key in origValue) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = origValue[key]
      }
    }
  }
}
