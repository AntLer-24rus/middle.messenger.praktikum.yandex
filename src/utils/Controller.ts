import type { Component } from './Component'
import { connect } from './connect'
import { EventBus } from './EventBus'
import type { Service } from './Service'

export abstract class Controller<
  C extends Component = Component
> extends EventBus {
  static listening = {
    mount: 'Controller:mount',
    show: 'Controller:show',
    hide: 'Controller:hide',
  }

  protected baseComponent: C

  protected service: Service | null = null

  // protected _props: unknown

  constructor(component: C) {
    super()
    // this._props = props
    this.baseComponent = component

    connect(this, Controller.listening.mount, this._mount.bind(this))
    connect(this, Controller.listening.show, this._show.bind(this))
    connect(this, Controller.listening.hide, this._hide.bind(this))
  }

  private _mount(selector: string) {
    if (!this.baseComponent) {
      throw new Error('Mount before create component')
    }
    this.baseComponent.mount(selector)
  }

  private _show() {
    if (!this.baseComponent) {
      throw new Error('Show before create component')
    }
    this.baseComponent.show()
  }

  private _hide() {
    if (!this.baseComponent) {
      throw new Error('Hide before create component')
    }
    this.baseComponent.hide()
  }
}

export interface ExtendControllerConstructor<
  C extends Component = Component,
  T extends Controller<C> = Controller<C>
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (props: any): T
}
