import { registerHelper } from 'handlebars'
import { v4 as uuid } from 'uuid'
import { EventBus } from './index'

export interface ComponentOptions<DataType = any, PropsType = any> {
  name: string
  parent?: Component
  props?: PropsType
  data?: () => DataType
  listeners?: { eventName: string; callback: (...args: any[]) => void }[]
  events?: Record<
    string,
    (
      this: DataType & PropsType & { emit: Component<DataType>['emit'] },
      e: Event
    ) => void
  >
}

type ComponentMeta = {
  id: string
  name: string
}

export interface ComponentInterface {
  mount(selector?: string): void
  name: string
  id: string
}

export const enum BASE_COMPONENT_EVENTS {
  RENDER = 'render',
  MOUNTED = 'mounted',
  UPDATE = 'update',
  UPDATED = 'updated',
  NATIVE_EVENT = 'native:event',
}

const enum t {}
export abstract class Component<DataType = any> implements ComponentInterface {
  static EVENT_PREFIX: string = '$'
  // [key: string | symbol]: any
  private _meta: ComponentMeta
  private _element: Element | null = null
  protected data: DataType
  private _events: Record<string, (e: Event) => void> = {}
  private _eventBus: EventBus = new EventBus()
  private _parent: Component | undefined = undefined
  private _children: Component[] = []
  private _nativeListeners: {
    el: Element
    eventName: string
    callback: (e: Event) => void
  }[] = []
  protected needUpdate: boolean = false

  constructor({
    name,
    parent,
    props = {},
    data = (): any => ({}),
    events = {},
    listeners,
  }: ComponentOptions<DataType>) {
    this._meta = { name, id: uuid() }
    this._parent = parent

    const prepData = data.call(props)
    this.data = new Proxy(
      { ...prepData, ...props },
      {
        set: (target, prop, value) => {
          if (Object.prototype.hasOwnProperty.call(target, prop)) {
            const updated =
              JSON.stringify(target[prop]) !== JSON.stringify(value)
            if (updated) {
              this.needUpdate = true
              target[prop] = value
              return true
            }
            return true
          }
          return false
        },
      }
    )
    this._events = events

    this._registerEvents(listeners)
  }

  public get children() {
    return this._children
  }
  public get parent() {
    return this._parent
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
    if (this.needUpdate) this._eventBus.emit(BASE_COMPONENT_EVENTS.RENDER)
  }

  public emit(eventName: string, ...args: any) {
    this._eventBus.emit(eventName, ...args)
  }
  private _registerEvents(
    listeners: { eventName: string; callback: () => void }[] = []
  ) {
    this._eventBus.on(BASE_COMPONENT_EVENTS.RENDER, this._render.bind(this))
    this._eventBus.on(BASE_COMPONENT_EVENTS.MOUNTED, () => {})
    this._eventBus.on(
      BASE_COMPONENT_EVENTS.NATIVE_EVENT,
      this._callNativeEvent.bind(this)
    )
    this._eventBus.on(BASE_COMPONENT_EVENTS.UPDATE, this._update.bind(this))
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
      this.emit(BASE_COMPONENT_EVENTS.NATIVE_EVENT, callbackName, event)
    el.addEventListener(eventName, callback)
    this._nativeListeners.push({ el, eventName, callback })
  }
  private _callNativeEvent(methodName: string, e: Event) {
    const method = this._events[methodName]
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
    const eventThis: DataType & { emit?: any } = {
      ...this.data,
      emit: this.emit.bind(this),
    }
    method.call(eventThis, ...args)
    delete eventThis.emit
    Object.assign(this.data, eventThis)
    if (this.needUpdate) this.emit(BASE_COMPONENT_EVENTS.RENDER)
  }

  private _parseAttr(attr: Attr): [string, string] {
    const eventName = attr.name.slice(Component.EVENT_PREFIX.length)
    const callbackName = attr.value
    return [eventName, callbackName]
  }
  private _addEvents(element: Element = this.element) {
    let removeAttr = []
    for (const attr of element.attributes) {
      if (attr.name.startsWith(Component.EVENT_PREFIX)) {
        this._addNativeEventListener(element, ...this._parseAttr(attr))
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
          this._addNativeEventListener(child, ...this._parseAttr(attr))
          removeAttr.push(attr)
        }
      }
      removeAttr.forEach((attr) => {
        child.removeAttributeNode(attr)
      })
      this._addEvents(child)
    }

    // Object.keys(this._events).forEach((eventName) => {
    //   this._element!.addEventListener(eventName, this._events[eventName])
    // })
  }
  private _removeEvents() {
    let listener = this._nativeListeners.pop()
    while (listener) {
      listener.el.removeEventListener(listener.eventName, listener.callback)
      listener = this._nativeListeners.pop()
    }
    // if (!this._element)
    //   throw new Error('Удаление обработчиков до создания компонента')
    // Object.keys(this._events).forEach((eventName) => {
    //   this._element!.removeEventListener(eventName, this._events[eventName])
    // })
  }

  protected get element(): HTMLElement {
    if (!this._element) throw new Error('Элемент еще не создан')
    return this._element as HTMLElement
  }

  // Public interface --------------------------------------------

  public show() {
    this.element.style.display = ''
  }
  public hide() {
    this.element.style.display = 'none'
  }
  public getContent() {
    const content = this._element
    if (!content)
      throw new Error('Запрос на получение компонента до инициализации')
    return content
  }
  public get name() {
    return this._meta.name
  }
  public get id() {
    return this._meta.id
  }

  public getParentByName(name: string): Component | null {
    if (this.name === name) return this
    const parent = this.parent
    if (!parent) return null
    return parent.getParentByName(name)
  }
  public getChildrenByName(name: string): Component | undefined {
    return this.children.find((c) => c.name === name)
  }
  public setProps(data: any) {
    this._eventBus.emit(BASE_COMPONENT_EVENTS.UPDATE, data)
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
