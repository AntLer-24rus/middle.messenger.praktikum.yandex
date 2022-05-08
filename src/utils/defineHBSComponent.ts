import type { RuntimeOptions, TemplateDelegate } from 'handlebars'
import {
  Component,
  ComponentOptions,
  last,
  first,
  saveReplaceProperty,
} from './'

const EVENT_PREFIX = '$'
const DATA_SET_ID = 'id'

const noopRender: TemplateDelegate = (ctx) => ''
type ComponentSlots = Record<string, TemplateDelegate>

interface DefineComponentOptions<DataType = any>
  extends Omit<ComponentOptions<DataType>, 'parent'> {
  components?: HBSComponentConstructor[]
  slots?: ComponentSlots
  renderer: TemplateDelegate
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

export function defineHBSComponent<DataType = any>(
  options: DefineComponentOptions<DataType>
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
    private _slots: ComponentSlots = {}
    private _hbsRuntimeOptions: RuntimeOptions
    private _indexCompPartial: number = 0
    public static componentName: string = options.name
    constructor(hbsOptions: HBSComponentOptions) {
      super({
        name: options.name,
        data: options.data,
        props: hbsOptions.props,
        events: options.events,
      })
      this._hbsRuntimeOptions = {
        partials: {
          comp: this._prepareComponent.bind(this),
          slot: this._prepareSlot.bind(this),
        },
      }
      this._slots = hbsOptions.slots ?? {}
      console.log(`Created component ${HBSComponent.componentName}`)
      this.init()
    }
    private setSlots(slots: ComponentSlots) {
      this._slots = slots
      this.init()
    }
    private getChild(name: string): HBSComponent {
      let comp = this.children.filter((ch) => ch.name === name)[
        this._indexCompPartial
      ] as HBSComponent
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

      return slotRenderer(
        { ...this.data, parentComponent: this },
        this._hbsRuntimeOptions.partials
      )
    }
    private _prepareComponent(...args: any[]): string {
      const { parentComponent = this }: { parentComponent: HBSComponent } =
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

      const ComponentConstructor = getKnownComponent(componentName)
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
  return HBSComponent
}
