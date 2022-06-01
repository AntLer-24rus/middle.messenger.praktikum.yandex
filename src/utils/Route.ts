import type { Component, ExtendComponentConstructor } from './Component'

function isEqual(strA: string, strB: string): boolean {
  return strA === strB
}

export class Route {
  private _pathname: string

  private _blockClass: ExtendComponentConstructor

  private _block: Component | null

  private _props: unknown

  constructor(
    pathname: string,
    view: ExtendComponentConstructor,
    props: unknown
  ) {
    this._pathname = pathname
    this._blockClass = view
    this._block = null
    this._props = props
  }

  // navigate(pathname: string) {
  //   if (this.match(pathname)) {
  //     this._pathname = pathname
  //     this.render()
  //   }
  // }

  leave() {
    if (this._block) {
      this._block.hide()
    }
  }

  setProps(props: unknown) {
    this._props = props
  }

  match(pathname: string) {
    return isEqual(pathname, this._pathname)
  }

  render(selector: string) {
    if (!this._block) {
      this._block = new this._blockClass({ props: this._props })
    }
    this._block.mount(selector)

    this._block.show()
  }
}
