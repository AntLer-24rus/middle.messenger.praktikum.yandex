import type {
  HelperOptions,
  RuntimeOptions,
  TemplateDelegate,
} from 'handlebars'
import {
  Component,
  ComponentOptions,
  BASE_COMPONENT_EVENTS,
  last,
  first,
  saveReplaceProperty,
} from './'

// const EVENT_PREFIX = '$'
const EVENT_PREFIX_SLOT = `${Component.EVENT_PREFIX}slot:`
const DATA_SET_ID = 'id'

const noopRender: TemplateDelegate = (ctx) => ''
type ComponentSlots = Record<
  string,
  (context: any, options: RuntimeOptions) => string
>

type HBSComponentProps = {
  name: string
}

interface DefineHBSComponentOptions<DataType = any, PropsType = any>
  extends Omit<ComponentOptions<DataType, PropsType>, 'parent' | 'events'> {
  components?: HBSComponentConstructor[]
  slots?: ComponentSlots
  renderer: TemplateDelegate

  nativeEvents?: ComponentOptions<DataType, PropsType>['events']
}

interface HBSComponentOptions<DataType = any>
  extends Omit<ComponentOptions<DataType>, 'name'> {
  slots?: ComponentSlots
}

interface HBSComponentConstructor {
  new (options: HBSComponentOptions): Component
  componentName: string
}

const knownComponents: HBSComponentConstructor[] = []

export function defineHBSComponent<DataType = any, PropsType = any>(
  options: DefineHBSComponentOptions<DataType, PropsType>
) {
  knownComponents.push(...(options.components ?? []))
  const renderer = options.renderer
  function getKnownComponent(
    componentName: string
  ): typeof HBSComponent | undefined {
    return knownComponents.find((kc) => {
      return kc.componentName === componentName
    }) as typeof HBSComponent
  }
  class HBSComponent extends Component {
    public static componentName: string = options.name
    private _slots: ComponentSlots = {}
    private _hbsRuntimeOptions: RuntimeOptions
    private _indexCompPartial: number = 0

    constructor(hbsOptions: HBSComponentOptions) {
      const props = Object.assign({}, options.props, hbsOptions.props)
      // const events = Object.assign({}, options.events, hbsOptions.events)
      super({
        name: options.name,
        data: options.data,
        props,
        events: options.nativeEvents,
        listeners: hbsOptions.listeners,
        parent: hbsOptions.parent,
      })
      // for (const key in hbsOptions.events) {
      //   if (Object.prototype.hasOwnProperty.call(hbsOptions.events, key)) {
      //     const event = hbsOptions.events[key]
      //     this.events[key] = (e: Event): void => {
      //       const eventThis = { ...this.data }
      //       event.call(eventThis, e)
      //       Object.assign(this.data, eventThis)
      //       if (this.needUpdate) this.emit(BASE_COMPONENT_EVENTS.RENDER)
      //     }
      //   }
      // }
      this._hbsRuntimeOptions = {
        partials: {
          comp: this._prepareComponent.bind(this),
          slot: this._prepareSlot.bind(this),
        },
      }
      this._slots = hbsOptions.slots ?? {}
      this.emit(BASE_COMPONENT_EVENTS.RENDER)
    }
    private setSlotsAndProps(slots: ComponentSlots, props: any) {
      this._slots = slots
      if (Object.keys(slots).length > 0) this.needUpdate = true
      this.setProps(props)
    }
    private getChild(name: string): HBSComponent {
      let comp = this.children[this._indexCompPartial] as HBSComponent
      return comp
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

      return slotRenderer({ parentComponent: this }, this._hbsRuntimeOptions)
    }
    private _prepareComponent(...args: any[]): string {
      const { parentComponent = this }: { parentComponent?: HBSComponent } =
        first(args)
      const {
        hash: { name: componentName, ...propsAndHandler },
        fn: blockRenderer = noopRender,
        partials: basePartials,
      }: HelperOptions & RuntimeOptions = last(args)

      const props = Object.fromEntries(
        Object.entries(propsAndHandler).filter(
          ([key]) => !key.startsWith(Component.EVENT_PREFIX)
        )
      )

      const slots: ComponentSlots = {}
      const listeners: {
        eventName: string
        callback: (...args: any[]) => void
      }[] =
        Object.entries(propsAndHandler)
          .filter(([key]) => key.startsWith(Component.EVENT_PREFIX))
          .map(([key, value]) => ({
            eventName: `${componentName}:${key.slice(
              Component.EVENT_PREFIX.length
            )}`,
            callback: value as (...args: any[]) => void,
          })) ?? []

      const collectSlotRenderer: TemplateDelegate = (...args: any[]) => {
        const {
          hash: { name: slotName },
          fn: slotRenderer,
        } = last(args)
        slots[slotName] = (_: any, { partials: localPartials }) => {
          const restorePartials = saveReplaceProperty(
            basePartials,
            localPartials
          )
          const slotTemplate = slotRenderer({ ...this.data })
          restorePartials()
          return slotTemplate.replace(
            /(\$.+=")(.+)(")/gm,
            `$1$2.slot_${slotName}$3`
          )
        }
        const l = slotRenderer({ ...this.data }).matchAll(
          /\$.+="(?<name>.+)"/gm
        )
        for (const { groups } of l) {
          if (options.nativeEvents) {
            const event = options.nativeEvents[groups.name]
            listeners.push({
              eventName: `${groups.name}.slot_${slotName}`,
              callback: (...args: any[]) => {
                parentComponent.callEventInContext(event, ...args)
              },
            })
          }
        }
        return ''
      }
      const restorePartials = saveReplaceProperty(basePartials, {
        slot: collectSlotRenderer,
        comp: () => '',
      })
      blockRenderer(this.data)
      restorePartials()

      const ComponentConstructor = getKnownComponent(componentName)
      if (!ComponentConstructor)
        throw new Error(
          `Компонент ${componentName} не найден в известных компонентах`
        )

      let component = parentComponent.getChild(componentName)

      if (!component) {
        // parentComponent.bindEvents(events)
        component = new ComponentConstructor({
          slots,
          parent: parentComponent,
          props,
          listeners,
        })

        parentComponent.children.push(component)
      } else {
        component.setSlotsAndProps(slots, props)
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
      const template = renderer({ ...context }, this._hbsRuntimeOptions)
      fragment.innerHTML = template

      for (const child of this.children) {
        const stub = fragment.content.querySelector(
          `[data-${DATA_SET_ID}="${child.id}"]`
        )
        if (!stub) {
          throw new Error(
            `Не найден stub с id ${child.id} в компоненте ${this.name}`
          )
        }
        stub.replaceWith(child.getContent())
      }

      return fragment.content
    }
  }
  return HBSComponent
}
