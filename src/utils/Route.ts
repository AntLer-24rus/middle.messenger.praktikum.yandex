import { Controller, ExtendControllerConstructor } from './Controller'
import { isEqual } from './isEqual'

export class Route {
  private _pathname: string

  private _ComponentController: ExtendControllerConstructor

  private _controller: Controller | null

  private _props: any // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(
    pathname: string,
    ControllerConstructor: ExtendControllerConstructor,
    props: unknown
  ) {
    this._pathname = pathname
    this._controller = null
    this._ComponentController = ControllerConstructor
    this._props = props
  }

  leave() {
    if (this._controller) {
      this._controller = null
    }
  }

  setProps(props: unknown) {
    this._props = props
  }

  match(pathname: string) {
    return isEqual(pathname, this._pathname)
  }

  render(selector: string) {
    if (!this._controller) {
      this._controller = new this._ComponentController({ props: this._props })
    }

    this._controller.emit(Controller.listening.mount, selector)
    this._controller.emit(Controller.listening.show)
  }
}
