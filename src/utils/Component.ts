import { RuntimeOptions, TemplateDelegate } from 'handlebars'
import { v4 as uuid } from 'uuid'
import { last, first, EventBus } from './index'
import { saveReplaceProperty } from './saveReplaceProperty'

const EVENT_PREFIX = '$'
const EVENT_PREFIX_SLOT = '$slot:'
const DATA_SET_ID = 'id'

const noopRender: TemplateDelegate = (ctx) => ''

type ComponentSlots = Record<string, TemplateDelegate>
type ComponentOptions<T = any> = {
  name: string
  renderer: TemplateDelegate
  parent?: Component
  slotRenderer?: Function
  slots?: ComponentSlots
  methods?: Record<string, Function>
  components?: ComponentExtConstructor[]
  props?: any
  data?: () => T
  listeners?: { eventName: string; callback: () => void }[]
  events?: Record<string, (this: T, e: Event) => void>
}

interface BaseComponentOptions {
  name: string
  parent?: Component
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

  abstract render(context: any): DocumentFragment
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

const knownComponents: ComponentExtConstructor[] = []
export function defineComponent<T = any>(
  options: ComponentOptions<T>
): ComponentExtConstructor {
  knownComponents.push(...(options.components ?? []))
  const renderer = options.renderer

  // FIXME Перерендер дочерних компонентов каждый раз при рендере родителя
  const extComponent = class extends Component {
    private _slots: ComponentSlots = {}
    private _hbsRuntimeOptions: RuntimeOptions
    private _indexCompPartial: number = 0

    public static componentName: string = options.name
    constructor(extOptions: ComponentExtOptions) {
      super({
        ...extOptions,
        ...options,
      })
      this._hbsRuntimeOptions = {
        partials: {
          comp: this._prepareComponent.bind(this),
          slot: this._prepareSlot.bind(this),
        },
      }
      this._slots = extOptions.slots ?? {}
      console.log(`Created component ${extComponent.componentName}`)
      this.init()
    }

    private setSlots(slots: ComponentSlots) {
      this._slots = slots
      this.init()
    }
    private getChild(name: string): Component {
      let comp = this.children.filter((ch) => ch.name === name)[
        this._indexCompPartial
      ]
      return comp
    }
    private _getKnownComponent(
      componentName: string
    ): ComponentExtConstructor | undefined {
      return knownComponents.find((kc) => kc.componentName === componentName)
    }
    private _prepareSlot(...args: any[]): string {
      const {
        hash: { name: slotName },
        fn: baseSlotRenderer = noopRender,
      }: {
        hash: { name: string }
        fn: TemplateDelegate
      } = last(args)

      const slotRenderer = this._slots[slotName] ?? baseSlotRenderer

      return slotRenderer(
        { parentComponent: this },
        this._hbsRuntimeOptions.partials
      )
    }
    private _prepareComponent(...args: any[]): string {
      const { parentComponent = this }: { parentComponent: Component } =
        first(args)
      const {
        hash: { name: componentName, ...propsAndHandler },
        fn: blockRenderer = noopRender,
        partials: basePartials,
      }: {
        hash: { name: string; [key: string]: any }
        fn: TemplateDelegate
        partials: any
      } = last(args)

      const props = Object.fromEntries(
        Object.entries(propsAndHandler).filter(
          ([key]) => !key.startsWith(EVENT_PREFIX)
        )
      )

      const slots: ComponentSlots = {}
      const collectSlotRenderer: TemplateDelegate = (...args: any[]) => {
        const {
          hash: { name: slotName },
          fn: slotRenderer,
        } = last(args)
        slots[slotName] = (context: any, localPartials: any) => {
          const restorePartials = saveReplaceProperty(
            basePartials,
            localPartials
          )
          const slotTemplate = slotRenderer(context)
          restorePartials()
          return slotTemplate
        }
        return ''
      }
      const restorePartials = saveReplaceProperty(basePartials, {
        slot: collectSlotRenderer,
      })
      blockRenderer(this.data)
      restorePartials()

      const ComponentConstructor = this._getKnownComponent(componentName)
      if (!ComponentConstructor)
        throw new Error(
          `Компонент ${componentName} не найден в известных компонентах`
        )

      let component = parentComponent.getChild(componentName)
      console.log(
        `component ${this.name} - ${parentComponent.name}:>> `,
        component?.name,
        component?.id
      )

      if (!component) {
        component = new ComponentConstructor({
          slots,
          parent: parentComponent,
          props: Object.fromEntries(
            Object.entries(props).filter(
              ([key]) => !key.startsWith(EVENT_PREFIX)
            )
          ),
        })

        parentComponent.children.push(component)
      } else {
        if (Object.keys(slots).length > 0) component.setSlots(slots)
      }

      const dataAttr = `data-${DATA_SET_ID}="${component.id}`

      parentComponent._indexCompPartial++
      return `
      <div ${dataAttr}">${componentName} -> ${JSON.stringify(props)}</div>
      `.trim()
    }
    render(context: any): DocumentFragment {
      const fragment = document.createElement('template')

      this._indexCompPartial = 0
      fragment.innerHTML = renderer(context, this._hbsRuntimeOptions)

      for (const child of this.children) {
        const stub = fragment.content.querySelector(
          `[data-${DATA_SET_ID}="${child.id}"]`
        )
        if (!stub) {
          console.error(this)
          throw new Error(
            `Не найден stub с id ${child.id} в компоненте ${this.name}`
          )
        }
        stub.replaceWith(child.getContent())
      }

      return fragment.content
    }
  }
  return extComponent
}
