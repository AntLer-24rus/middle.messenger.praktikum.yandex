import type {
  HelperOptions,
  RuntimeOptions,
  TemplateDelegate,
} from 'handlebars'

import { Component, ComponentOptions } from './Component'

import { last } from './last'
import { first } from './first'
import { saveReplaceProperty } from './saveReplaceProperty'

const DATA_SET_ID = 'id'

const noopRender: TemplateDelegate = () => ''
type ComponentSlots = Record<
  string,
  (context: any, options: RuntimeOptions) => string
>

interface HBSComponentOptions<DataType = any>
  extends Omit<ComponentOptions<DataType>, 'name'> {
  slots?: ComponentSlots
}

interface HBSComponentConstructor<T = Component> {
  new (options: HBSComponentOptions): T
  componentName: string
}

interface DefineHBSComponentOptions<DataType = any, PropsType = any>
  extends Omit<ComponentOptions<DataType, PropsType>, 'parent' | 'events'> {
  components?: HBSComponentConstructor[]
  slots?: ComponentSlots
  renderer: TemplateDelegate

  nativeEvents?: ComponentOptions<DataType, PropsType>['events']
}

type ListenersType = Required<ComponentOptions>['listeners']

const knownComponents: HBSComponentConstructor[] = []

export function defineHBSComponent<DataType = any, PropsType = any>(
  options: DefineHBSComponentOptions<DataType, PropsType>
) {
  const { renderer, components = [] } = options
  knownComponents.push(...components)
  function getKnownComponent(
    componentName: string
  ): HBSComponentConstructor | undefined {
    return knownComponents.find(
      (kc) => kc.componentName === componentName
    ) as HBSComponentConstructor
  }
  class HBSComponent extends Component {
    public static componentName: string = options.name

    private _slots: ComponentSlots = {}

    private _hbsRuntimeOptions: RuntimeOptions

    private _indexCompPartial = 0

    constructor(hbsOptions: HBSComponentOptions) {
      const props = { ...options.props, ...hbsOptions.props }
      super({
        name: options.name,
        data: options.data,
        props,
        events: options.nativeEvents,
        listeners: hbsOptions.listeners,
        parent: hbsOptions.parent,
      })
      this._hbsRuntimeOptions = {
        partials: {
          comp: this._prepareComponent.bind(this),
          slot: this._prepareSlot.bind(this),
        },
      }
      this._slots = hbsOptions.slots ?? {}
      this.emit(Component.EVENTS.RENDER)
    }

    private setSlotsAndProps(slots: ComponentSlots, props: any) {
      this._slots = slots
      if (Object.keys(slots).length > 0) this.needUpdate = true
      this.setProps(props)
    }

    private getChild(): HBSComponent {
      const comp = this.children[this._indexCompPartial] as HBSComponent
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
      const listeners: ListenersType =
        Object.entries(propsAndHandler as { [key: string]: () => void })
          .filter(([key]) => key.startsWith(Component.EVENT_PREFIX))
          .map(([key, callback]) => ({
            eventName: `${componentName}:${key.slice(
              Component.EVENT_PREFIX.length
            )}`,
            callback,
          })) ?? []

      const collectSlotRenderer: TemplateDelegate = (
        ...collectSlotRendererArgs: any[]
      ) => {
        const {
          hash: { name: slotName },
          fn: slotRenderer,
        } = last(collectSlotRendererArgs)
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
              callback: (...callbackArgs: any[]) => {
                parentComponent.callEventInContext(event, ...callbackArgs)
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

      const ComponentConstructor = getKnownComponent(
        componentName
      ) as HBSComponentConstructor<HBSComponent>
      if (!ComponentConstructor)
        throw new Error(
          `Компонент ${componentName} не найден в известных компонентах`
        )

      let component = parentComponent.getChild()

      if (!component) {
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

      // eslint-disable-next-line no-underscore-dangle
      parentComponent._indexCompPartial += 1
      return `
      <div ${dataAttr}">${componentName} -> ${JSON.stringify(props)}</div>
      `.trim()
    }

    render(context: any): DocumentFragment {
      const fragment = document.createElement('template')

      this._indexCompPartial = 0
      const template = renderer({ ...context }, this._hbsRuntimeOptions)
      fragment.innerHTML = template

      let idx = 0
      let child = this.children[idx]
      while (child) {
        const stub = fragment.content.querySelector(
          `[data-${DATA_SET_ID}="${child.id}"]`
        )
        if (!stub) {
          this.children.splice(idx, 1)
        } else {
          stub.replaceWith(child.getContent())
          idx += 1
        }
        child = this.children[idx]
      }
      return fragment.content
    }
  }
  return HBSComponent
}
