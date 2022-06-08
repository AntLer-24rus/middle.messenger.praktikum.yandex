/* eslint
    no-param-reassign: ["error", { "props": false }],
    @typescript-eslint/no-explicit-any: off
*/
import { v4 as uuid } from 'uuid'
import { Callback, EventBus, EventBusInterface } from './EventBus'
import { isEqual } from './isEqual'
import { Tree } from './Tree'

type DataFunction<T1, T2> = (this: T1) => T2

type ComponentMeta = {
  id: string
  name: string
}

export interface ComponentInterface<DataType, PropsType> {
  id: string
  name: string
  children: ReadonlyArray<ComponentInterface<any, any>>
  parent: ComponentInterface<any, any> | undefined
  data: DataType & PropsType
  element: HTMLElement
  needUpdate: boolean
  appendChildren(child: this): this
  getParentByName(name: string): ComponentInterface<any, any> | undefined
  getChildrenByName(name: string): ComponentInterface<any, any> | undefined
  getContent(): Element
  setProps(props: Partial<DataType & PropsType>): void

  emit(eventName: string, ...args: any[]): void

  show(): void
  hide(): void
  mount(selector?: string): void
}

export interface ComponentOptions<DataType, PropsType> {
  name: string
  props: PropsType
  data: DataFunction<PropsType, DataType>
  listeners: { eventName: string; callback: (...args: any[]) => void }[]
  DOMEvents: Record<
    string,
    (this: ComponentInterface<DataType, PropsType>, e: Event) => void
  >
}

export abstract class Component<
    DataType extends object = any,
    PropsType extends object = any
  >
  extends Tree
  implements ComponentInterface<DataType, PropsType>, EventBusInterface
{
  static EVENT_PREFIX = '$'

  static emits = {
    RENDER: 'render',
    MOUNTED: 'mounted',
    UPDATE: 'update',
    UPDATED: 'updated',
    NATIVE_EVENT: 'native:event',
  }

  private _meta: ComponentMeta

  private _element: Element | null = null

  public data: DataType & PropsType

  private _DOMEvents: Record<
    string,
    (this: ComponentInterface<DataType, PropsType>, e: Event) => void
  > = {}

  private _eventBus: EventBus = new EventBus()

  private _nativeListeners: {
    el: Element
    eventName: string
    callback: (e: Event) => void
  }[] = []

  public needUpdate = false

  constructor({
    name,
    props,
    data,
    DOMEvents = {},
    listeners,
  }: ComponentOptions<DataType, PropsType>) {
    super()
    this._meta = { name, id: uuid() }
    const prepData = { ...data.call(props), ...props }
    this.data = new Proxy(prepData, {
      set: (target: any, prop, value) => {
        if (Object.prototype.hasOwnProperty.call(target, prop)) {
          if (!isEqual(target[prop], value)) {
            this.needUpdate = true
            target[prop] = value
          }
          return true
        }
        return false
      },
    })

    this._DOMEvents = DOMEvents
    this._registerEvents(listeners)
  }

  off(eventName: string, callback: Callback): void {
    this._eventBus.off(eventName, callback)
  }

  protected abstract render(context: any): DocumentFragment

  private _render() {
    // console.log(`Render ${this.name}.${this.id}`)
    const fragment = this.render({ ...this.data })

    const first = fragment.firstElementChild
    if (!first)
      throw new Error('Ошибка в шаблоне, невозможно получить первый элемент')

    if (this._element) {
      this._removeEvents()
      this._element.replaceWith(first)
    }

    this._element = first

    this._addEvents()
    this.needUpdate = false
  }

  private _update(data: any) {
    Object.assign(this.data, data)
    if (this.needUpdate) this._eventBus.emit(Component.emits.RENDER)
  }

  private _registerEvents(
    listeners: { eventName: string; callback: () => void }[] = []
  ) {
    this._eventBus.on(Component.emits.RENDER, this._render.bind(this))
    this._eventBus.on(
      Component.emits.NATIVE_EVENT,
      this._callNativeEvent.bind(this)
    )
    this._eventBus.on(Component.emits.UPDATE, this._update.bind(this))
    for (const listener of listeners) {
      this._eventBus.on(listener.eventName, listener.callback.bind(this))
    }
  }

  private _addNativeEventListener(
    el: Element,
    eventName: string,
    callbackName: string
  ) {
    const callback = (event: Event) =>
      this.emit(Component.emits.NATIVE_EVENT, callbackName, event)
    el.addEventListener(eventName, callback)
    this._nativeListeners.push({ el, eventName, callback })
  }

  private _callNativeEvent(methodName: string, e: Event) {
    const method = this._DOMEvents[methodName]
    if (method && typeof method === 'function') {
      this.callEventInContext(method, e)
    } else {
      this._eventBus.emit(methodName, e)
    }
  }

  protected callEventInContext(
    method: (...args: any[]) => void,
    ...args: any[]
  ): void {
    method.call(this, ...args)
    if (this.needUpdate) this.emit(Component.emits.RENDER)
  }

  private _addEvents(element: Element = this.element) {
    function parseAttr(attr: Attr): [string, string] {
      const eventName = attr.name.slice(Component.EVENT_PREFIX.length)
      const callbackName = attr.value
      return [eventName, callbackName]
    }

    let removeAttr = []
    for (const attr of element.attributes) {
      if (attr.name.startsWith(Component.EVENT_PREFIX)) {
        this._addNativeEventListener(element, ...parseAttr(attr))
        removeAttr.push(attr)
      }
    }
    removeAttr.forEach((attr) => {
      element.removeAttributeNode(attr)
    })
    for (const child of element.children) {
      removeAttr = []
      for (const attr of child.attributes) {
        if (attr.name.startsWith(Component.EVENT_PREFIX)) {
          this._addNativeEventListener(child, ...parseAttr(attr))
          removeAttr.push(attr)
        }
      }
      removeAttr.forEach((attr) => {
        child.removeAttributeNode(attr)
      })
      this._addEvents(child)
    }
  }

  private _removeEvents() {
    let listener = this._nativeListeners.pop()
    while (listener) {
      listener.el.removeEventListener(listener.eventName, listener.callback)
      listener = this._nativeListeners.pop()
    }
  }

  get element(): HTMLElement {
    if (!this._element) throw new Error('Элемент еще не создан')
    return this._element as HTMLElement
  }

  // Public interface --------------------------------------------

  public get id(): string {
    return this._meta.id
  }

  public get name(): string {
    return this._meta.name
  }

  public getParentByName(name: string): Component<any, any> | undefined {
    if (this.name === name) {
      return this
    }
    const { parent } = this
    if (!parent) {
      return undefined
    }
    return parent.getParentByName(name)
  }

  public getChildrenByName(name: string): Component<any, any> | undefined {
    return this.children.find((c) => c.name === name)
  }

  public getContent(): Element {
    const content = this._element
    if (!content)
      throw new Error('Запрос на получение компонента до инициализации')
    return content
  }

  public setProps(props: Partial<DataType & PropsType>): void {
    this._eventBus.emit(Component.emits.UPDATE, props)
  }

  public on(event: string, callback: (...a: unknown[]) => void) {
    this._eventBus.on(event, callback)
  }

  public emit(eventName: string, ...args: unknown[]) {
    return this._eventBus.emit(eventName, ...args)
  }

  public show() {
    this.element.style.display = ''
  }

  public hide() {
    this.element.style.display = 'none'
  }

  public mount(selector: string) {
    if (this._parent)
      throw new Error(
        'Запрос на монтирование можно вызывать только у корневого элемента'
      )
    const mountPoint = document.querySelector(selector)
    if (!mountPoint)
      throw new Error(`В документе не найден селектор ${selector}`)
    mountPoint.innerHTML = ''
    mountPoint.append(this.getContent())
  }
}

export interface ExtendComponentConstructor<
  DataType extends object = any,
  PropsType extends object = any,
  T extends Component<DataType, PropsType> = Component<DataType, PropsType>
> {
  new (options: Partial<ComponentOptions<DataType, PropsType>>): T
  componentName: string
}
