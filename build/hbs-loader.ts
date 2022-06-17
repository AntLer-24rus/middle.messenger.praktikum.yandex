import { precompile } from 'handlebars'

export default function hbsLoader(content: string | Buffer) {
  if (typeof content === 'string') {
    const precompiled = precompile(content)
    return `
    import {template} from 'handlebars/runtime'
    export default template(${precompiled})`
  }
  throw new Error('HBS Loader: content must be a string')
}
