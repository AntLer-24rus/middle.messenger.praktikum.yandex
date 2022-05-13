/* eslint no-param-reassign: ["error", { "props": false }] */
export function saveReplaceProperty(obj: any, replacer: any) {
  const origValue: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const replacerValue = replacer[key]
      if (replacerValue) {
        origValue[key] = obj[key]
        obj[key] = replacerValue
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
