/* eslint
    no-underscore-dangle: ["error", { "allow": ["_parent", "_children", "_reparent"] }]
    no-param-reassign: ["error", { "props": false }]
*/
export abstract class Tree {
  protected _parent?: this

  protected _children: this[] = []

  private _reparent(newParent: this) {
    this.remove()
    this._parent = newParent
  }

  public remove(): void {
    if (this._parent) {
      this._parent.removeChild(this)
    }
  }

  public removeChild(child: this): void {
    const index = this._children.indexOf(child)
    if (index >= 0) {
      this._children.splice(index, 1)
      child._parent = undefined
    }
  }

  public get children(): ReadonlyArray<this> {
    return this._children
  }

  public get parent(): this | undefined {
    return this._parent
  }

  public appendChildren(child: this): this {
    child._reparent(this)
    this._children.push(child)
    return child
  }
}
