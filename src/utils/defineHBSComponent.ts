/* eslint @typescript-eslint/no-explicit-any: off */
import type {
  HelperOptions,
  RuntimeOptions,
  TemplateDelegate,
} from 'handlebars'
import {
  Component,
  ComponentInterface,
  ComponentOptions,
  ExtendComponentConstructor,
} from './Component'
import { first } from './first'
import { isEqual } from './isEqual'
import { last } from './last'
import { saveReplaceProperty } from './saveReplaceProperty'

const DATA_SET_ID = 'id'

const noopRender: TemplateDelegate = () => ''
type ComponentSlots = Record<
  string,
  (context: unknown, options: RuntimeOptions) => string
>

interface HBSComponentOptions<DataType, PropsType>
  extends Partial<
    Pick<ComponentOptions<DataType, PropsType>, 'props' | 'listeners'>
  > {
  slots?: ComponentSlots
  templateHash?: any
}

interface HBSComponentConstructor<
  DataType extends object = any,
  PropsType extends object = any,
  T extends Component<DataType, PropsType> = Component<DataType, PropsType>
> extends ExtendComponentConstructor {
  new (options: HBSComponentOptions<DataType, PropsType>): T
}

interface DefineHBSComponentOptions<
  DataType extends object,
  PropsType extends object,
  EmitsType extends object
> extends Partial<ComponentOptions<DataType, PropsType>> {
  name: string
  renderer: TemplateDelegate
  emits: EmitsType
  components?: HBSComponentConstructor[]
  slots?: ComponentSlots

  // nativeEvents?: ComponentOptions<DataType, PropsType, EmitsType>['DOMEvents']
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HBSComponentInterface<DataType = any, PropsType = any>
  extends ComponentInterface<DataType, PropsType> {
  // render(context: any): DocumentFragment
}

type ListenersType = Required<ComponentOptions<any, any>>['listeners']

const knownComponents: HBSComponentConstructor<any, any>[] = []

export function defineHBSComponent<
  PropsType extends object,
  EmitsType extends object,
  DataType extends object
>(options: DefineHBSComponentOptions<DataType, PropsType, EmitsType>) {
  const { renderer, components = [] } = options

  knownComponents.push(...components)
  function getKnownComponent(
    componentName: string
  ): HBSComponentConstructor<DataType, PropsType> | undefined {
    return knownComponents.find(
      (kc) => kc.componentName === componentName
    ) as HBSComponentConstructor<DataType, PropsType>
  }

  class HBSComponent
    extends Component<DataType, PropsType>
    implements HBSComponentInterface<DataType, PropsType>
  {
    public static componentName: string = options.name

    public static emits = {
      ...super.emits,
      ...options.emits,
    }

    private _slots: ComponentSlots = {}

    private _hbsRuntimeOptions: RuntimeOptions

    private _templateHash

    constructor(hbsOptions: HBSComponentOptions<DataType, PropsType>) {
      const props = { ...options.props, ...hbsOptions.props } as PropsType
      function defaultData(this: PropsType): DataType {
        return {} as DataType
      }

      const listeners: ComponentOptions<DataType, PropsType>['listeners'] = []

      if (hbsOptions.listeners) {
        listeners.push(...hbsOptions.listeners)
      }
      if (options.listeners) {
        listeners.push(...options.listeners)
      }

      super({
        name: options.name,
        data: options.data ?? defaultData,
        props,
        DOMEvents: options.DOMEvents ?? {},
        listeners,
      })
      this._templateHash = hbsOptions.templateHash
      this._hbsRuntimeOptions = {
        partials: {
          comp: this._prepareComponent.bind(this),
          slot: this._prepareSlot.bind(this),
        },
      }
      this._slots = hbsOptions.slots ?? {}
      this.emit(Component.emits.RENDER)
    }

    private setSlotsAndProps(slots: ComponentSlots, props: any) {
      this._slots = slots
      if (Object.keys(slots).length > 0) this.needUpdate = true
      this.setProps(props)
    }

    private getChildByHash(hash: any) {
      // eslint-disable-next-line no-underscore-dangle
      return this.children.find((comp) => isEqual(comp._templateHash, hash))
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

    private _prepareComponent(...args: unknown[]): string {
      const { parentComponent = this } = first(args) as {
        parentComponent?: HBSComponent
      }
      const {
        hash: { name: componentName, key: componentKey, ...propsAndHandler },
        fn: blockRenderer = noopRender,
        partials: basePartials,
      } = last(args) as HelperOptions & RuntimeOptions

      const props = Object.fromEntries(
        Object.entries(propsAndHandler).filter(
          ([key]) => !key.startsWith(Component.EVENT_PREFIX)
        )
      ) as PropsType

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
        ...collectSlotRendererArgs: unknown[]
      ) => {
        const {
          hash: { name: slotName },
          fn: slotRenderer,
        } = last(collectSlotRendererArgs) as { hash: any; fn: any }
        slots[slotName] = (_: unknown, { partials: localPartials }) => {
          const restorePartials = saveReplaceProperty(
            basePartials as Record<string, unknown>,
            localPartials as Record<string, unknown>
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
          if (options.DOMEvents) {
            const event = options.DOMEvents[groups.name]
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
      const restorePartials = saveReplaceProperty(
        basePartials as Record<string, unknown>,
        {
          slot: collectSlotRenderer,
          comp: () => '',
        }
      )
      blockRenderer(this.data)
      restorePartials()

      const ComponentConstructor = getKnownComponent(
        componentName
      ) as HBSComponentConstructor<DataType, PropsType, HBSComponent>
      if (!ComponentConstructor)
        throw new Error(
          `Компонент ${componentName} не найден в известных компонентах`
        )

      const templateHash = componentKey || { componentName, propsAndHandler }
      let component = parentComponent.getChildByHash(templateHash)

      if (!component) {
        component = parentComponent.appendChildren(
          new ComponentConstructor({
            slots,
            props,
            listeners,
            templateHash,
          })
        )
      } else {
        component.setSlotsAndProps(slots, props)
      }

      const dataAttr = `data-${DATA_SET_ID}="${component.id}`

      return `
      <div ${dataAttr}">${componentName} -> ${JSON.stringify(props)}</div>
      `.trim()
    }

    protected render(context: any): DocumentFragment {
      const fragment = document.createElement('template')

      const template = renderer({ ...context }, this._hbsRuntimeOptions)
      fragment.innerHTML = template

      let idx = 0
      let child = this.children[idx]
      while (child) {
        const stub = fragment.content.querySelector(
          `[data-${DATA_SET_ID}="${child.id}"]`
        )
        if (!stub) {
          // this.children.splice(idx, 1)
          child.remove()
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
