import { v4 as uuid } from 'uuid'
import { EventBus } from './index'

export interface ComponentOptions<DataType = any> {
  name: string
  parent?: Component
  props?: any
  data?: () => DataType
  listeners?: { eventName: string; callback: () => void }[]
  events?: Record<string, (this: DataType, e: Event) => void>
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

const enum EVENTS {
  RENDER = 'render',
  MOUNTED = 'mounted',
  UPDATE = 'update',
  UPDATED = 'updated',
  NATIVE_EVENT = 'native:event',
}
export abstract class Component implements ComponentInterface {
  [key: string | symbol]: any
  private _meta: ComponentMeta
  private _element: Element | null = null
  protected data: any
  private _events: Record<string, (e: Event) => void> = {}
  private _eventBus: EventBus = new EventBus()
  private _parent: Component | undefined = undefined
  // private _slots: ComponentSlots
  private _children: Component[] = []
  // private _renderer: Function
  private _nativeListeners: {
    el: Element
    eventName: string
    callback: (e: Event) => void
  }[] = []
  // private _hbsRuntimeOptions: RuntimeOptions

  constructor({
    name,
    parent,
    props = {},
    data = () => ({}),
    events = {},
    listeners,
  }: ComponentOptions) {
    this._meta = { name, id: uuid() }
    this._parent = parent

    this.data = new Proxy(
      { ...data(), ...props },
      {
        set: (target, prop, value) => {
          console.log(`set ${this.name}`, prop, value)
          target[prop] = value

          this._eventBus.emit(EVENTS.RENDER)
          return true
        },
      }
    )

    for (const key in events) {
      if (Object.prototype.hasOwnProperty.call(events, key)) {
        const element = events[key]
        this._events[key] = element.bind(this.data)
      }
    }

    this._registerEvents(listeners)
  }

  public get children() {
    return this._children
  }

  protected abstract render(context: any): DocumentFragment
  private _render() {
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
  }

  private _update(data: any) {
    console.log('new data :>> ', data)
    Object.assign(this.data, data)
  }

  protected init() {
    this._eventBus.emit(EVENTS.RENDER)
  }

  private _registerEvents(
    listeners: { eventName: string; callback: () => void }[] = []
  ) {
    this._eventBus.on(EVENTS.RENDER, this._render.bind(this))
    this._eventBus.on(EVENTS.MOUNTED, () => {})
    this._eventBus.on(EVENTS.NATIVE_EVENT, (methodName: string, e: Event) => {
      const method = this[methodName]
      if (this[methodName] && typeof this[methodName] === 'function')
        method.call(this, e)
      else console.warn(`Не найден ни один обработчик с именем ${methodName}`)
    })
    this._eventBus.on(EVENTS.UPDATE, this._update.bind(this))
    for (const listener of listeners) {
      this._eventBus.on(listener.eventName, listener.callback)
    }
  }

  private _addEventListener(
    el: Element,
    eventName: string,
    callbackName: string
  ) {
    const callback = (event: Event) =>
      this._eventBus.emit(EVENTS.NATIVE_EVENT, callbackName, event)
    el.addEventListener(eventName, callback)
    this._nativeListeners.push({ el, eventName, callback })
  }

  private _addEvents() {
    if (!this._element)
      throw new Error('Установка обработчиков до создания компонента')
    Object.keys(this._events).forEach((eventName) => {
      this._element!.addEventListener(eventName, this._events[eventName])
    })
  }
  private _removeEvents() {
    if (!this._element)
      throw new Error('Удаление обработчиков до создания компонента')
    Object.keys(this._events).forEach((eventName) => {
      this._element!.removeEventListener(eventName, this._events[eventName])
    })
  }

  // Public interface --------------------------------------------
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
  public setProps(data: any) {
    this._eventBus.emit(EVENTS.UPDATE, data)
    // for (const key in data) {
    //   if (
    //     Object.prototype.hasOwnProperty.call(data, key) &&
    //     Object.prototype.hasOwnProperty.call(this._data, key)
    //   ) {
    //     if (JSON.stringify(this._data[key]) !== JSON.stringify(data[key])) {
    //       this._data[key] = data[key]
    //     }
    //   }
    // }
  }
  public mount(selector: string) {
    if (this._parent)
      throw new Error(
        'Запрос на монтирование можно вызывать только у корневого элемента'
      )
    const mountPoint = document.querySelector(selector)
    if (!mountPoint)
      throw new Error(`В документе не найден селектор ${selector}`)
    mountPoint.append(this.getContent())
  }
}
