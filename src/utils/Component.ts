import { TemplateDelegate } from 'handlebars'
import { v4 as uuid } from 'uuid'
import { last, EventBus } from './index'

const EVENT_PREFIX = '$'
const EVENT_PREFIX_SLOT = '$slot:'

type ComponentOptions<T = any> = {
  name: string
  renderer: TemplateDelegate
  parent?: Component
  slotRenderer?: Function
  slots?: { name: string; renderer: () => string }[]
  methods?: Record<string, Function>
  components?: ComponentExtConstructor[]
  props?: any
  data?: () => T
  listeners?: { eventName: string; callback: () => void }[]
  events?: Record<string, (this: T, e: Event) => void>
}

export type ComponentExtOptions = Omit<ComponentOptions, 'name' | 'renderer'>

type ComponentMeta = {
  id: string
  name: string
}

export interface ComponentExtConstructor {
  new (options: ComponentExtOptions): Component
  [key: string | symbol]: any
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
  private _element: Element = document.createElement('div')
  private _data: any
  private _events: Record<string, (e: Event) => void> = {}
  private _eventBus: EventBus = new EventBus()
  private _parent: Component | undefined = undefined
  private _slots: { name: string; renderer: () => string }[] = []
  private _children: Component[] = []
  private _renderer: Function
  private _nativeListeners: {
    el: Element
    eventName: string
    callback: (e: Event) => void
  }[] = []

  constructor({
    name,
    parent,
    renderer,
    slots = [],
    components = [],
    props = {},
    data = () => ({}),
    events = {},
    listeners,
  }: ComponentOptions) {
    this._meta = { name, id: uuid() }
    this._renderer = renderer
    this._parent = parent

    // this._events = events
    this._slots = slots

    // const innerData = ()
    this._data = new Proxy(
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
        console.log(`${this.name} element :>> `, element)
        this._events[key] = element.bind(this._data)
      }
    }

    this._registerEvents(listeners)
    this._init(components)
  }

  private _update(data: any) {
    console.log('new data :>> ', data)
    Object.assign(this._data, data)
  }

  private _template(context: any): string {
    const res = this._renderer(context, {
      partials: {
        comp: (...args: any[]) => {
          const {
            hash,
            data: { index = 0 },
          } = last(args)

          const allChields = this._children.filter((c) => c.name === hash.name)
          const child = allChields[index]
          if (!child) throw new Error('Неизвестная ошибка')
          return `<div data-id="${child.id}"></div>`
        },
        slot: (...args: any[]) => {
          const { hash, fn: defaultRenderer = () => '' } = last(args)
          const slot = this._slots.find((s) => s.name === hash.name)
          let res: string = ''
          if (!slot) res = defaultRenderer()
          else res = slot.renderer()
          return res.replace(EVENT_PREFIX, EVENT_PREFIX_SLOT)
        },
      },
    })
    return res
  }

  private _init(components: ComponentExtConstructor[]) {
    const template = document.createElement('template')
    template.innerHTML = this._renderer(
      {},
      {
        partials: {
          comp: () => '',
          slot: () => '',
        },
      }
    )
    const first = template.content.children.item(0)
    if (!first || template.content.children.length > 1)
      throw new Error('Ошибка в шаблоне, должен быть один корневой элемент')
    this._element = first

    type PrepComp = {
      name: string
      slots: { name: string; renderer: () => string }[]
      childs: PrepComp[]
    }
    const stack: PrepComp[] = []
    this._renderer(
      { ...this._data },
      {
        partials: {
          comp: (...args: any[]) => {
            const { hash, fn } = last(args)
            stack.push({ name: hash.name, slots: [], childs: [] })
            if (fn && typeof fn === 'function') fn()
            const compDesc = stack.pop()
            if (!compDesc) throw new Error('Неизвестная ошибка')

            const CompConstructor = components.find(
              (c) => c.name === compDesc.name
            )
            if (!CompConstructor)
              throw new Error(
                `Компонент ${compDesc.name} не найден в зависимостях ${this.name}`
              )

            const comp = new CompConstructor({
              slots: compDesc.slots,
              props: Object.fromEntries(
                Object.entries(hash).filter(
                  ([key]) => key !== 'name' && !key.startsWith(EVENT_PREFIX)
                )
              ),
              parent: this,
              listeners: Object.entries(hash)
                .filter(([key]) => key.startsWith(EVENT_PREFIX))
                .map(([key, value]) => ({
                  eventName: key.slice(EVENT_PREFIX.length),
                  callback: () => value,
                })),
            })
            this._children.push(comp)
            return ''
          },
          slot: (...args: any[]) => {
            const { hash, fn } = last(args)
            const comp = last(stack)
            if (comp) {
              if (typeof fn !== 'function')
                throw new Error('Неправильное использование slot')
              comp.slots.push({
                name: hash.name,
                renderer: () => fn(this._data), //Передаем контекст root элемента
              })
              return fn()
            }
            return ''
          },
        },
      }
    )
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

  private _registerNativeEventListeners(children: HTMLCollection) {
    for (const child of children) {
      const removeAttr = []
      for (const attr of child.attributes) {
        if (attr.name.startsWith(EVENT_PREFIX_SLOT)) {
          const eventName = attr.name.slice(EVENT_PREFIX_SLOT.length)
          const callbackName = attr.value
          if (this._parent)
            this._parent._addEventListener(child, eventName, callbackName)
          else this._addEventListener(child, eventName, callbackName)
          removeAttr.push(attr)
        } else if (attr.name.startsWith(EVENT_PREFIX)) {
          const eventName = attr.name.slice(EVENT_PREFIX.length)
          const callbackName = attr.value
          this._addEventListener(child, eventName, callbackName)

          removeAttr.push(attr)
        }
      }
      removeAttr.forEach((attr) => {
        child.removeAttributeNode(attr)
      })
      this._registerNativeEventListeners(child.children)
    }
  }
  private _clearNativeEventListeners() {
    let listener = this._nativeListeners.pop()
    while (listener) {
      const { el, eventName, callback } = listener
      el.removeEventListener(eventName, callback)
      listener = this._nativeListeners.pop()
    }
  }

  private _addEvents() {
    Object.keys(this._events).forEach((eventName) => {
      this._element.addEventListener(eventName, this._events[eventName])
    })
  }
  private _removeEvents() {
    Object.keys(this._events).forEach((eventName) => {
      this._element.removeEventListener(eventName, this._events[eventName])
    })
  }
  private _render() {
    this._removeEvents()

    const fragment = document.createElement('template')

    this._element.innerHTML = ''

    fragment.innerHTML = this._template({ ...this._data })

    if (this._children.length) {
      let stub = fragment.content.querySelector<HTMLElement>(`[data-id]`)
      while (stub !== null) {
        const id = stub.dataset.id
        if (!id) throw new Error('Неизвестная ошибка')

        const child = this._children.find((c) => c.id === id)
        if (!child) throw new Error('Неизвестная ошибка')
        //FIXME Перерисовка всех дочек имеющих слоты в не зависимости от пропсов
        //FIXME Двойная перерисовка дочек имеющих слоты
        if (child._slots.length) child._render()

        stub.replaceWith(child.getContent())

        stub = fragment.content.querySelector<HTMLElement>(`[data-id]`)
      }
    }

    const first = fragment.content.firstChild
    if (!first) throw new Error('ошибка в шаблоне')
    this._element.append(...first.childNodes)

    this._addEvents()
    // if (this._parent) this._parent._eventBus.emit(EVENTS.RENDER)
  }

  // Public interface --------------------------------------------
  public getContent() {
    const content = this._element
    if (!content) throw new Error('Неизвестная ошибка')
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
    const mountPoint = document.querySelector(selector)
    if (!mountPoint)
      throw new Error(`В документе не найден селектор ${selector}`)
    mountPoint.append(this.getContent())
  }
}

export function defineComponent<T = any>(
  options: ComponentOptions<T>
): ComponentExtConstructor {
  // const res =
  return {
    [options.name]: class extends Component {
      constructor(extOptions: ComponentExtOptions) {
        super({
          ...extOptions,
          ...options,
        })
      }
    },
  }[options.name]

  // return new Proxy(res, {
  //   construct(target, args) {
  //     const obj = new target(args[0])
  //     return new Proxy(obj, {
  //       get: (t, p) => {
  //         console.log('get proxy :>> ', p)
  //         // if (p === '_events') {
  //         //   const events = t[p]
  //         //   Object.keys(events).forEach((k) => {
  //         //     events[k] = events[k].bind(this)
  //         //   })
  //         //   return events
  //         // }

  //         return t[p]
  //       },
  //       apply(t, thisArg, args) {
  //         console.log('thisArg :>> ', thisArg, args)
  //         t.apply(thisArg, args)
  //       },
  //     })
  //   },
  // })
}

// function trackClass(cls, options = {}) {
//   cls.prototype = trackObject(cls.prototype, options)
//   cls.prototype.constructor = cls

//   return new Proxy(cls, {
//     construct(target, args) {
//       const obj = new target(...args)
//       return new Proxy(obj, {
//         get: trackPropertyGet(options),
//         set: trackPropertySet(options),
//       })
//     },
//     apply: trackFunctionCall(options),
//   })
// }
