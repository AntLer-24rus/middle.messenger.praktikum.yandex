// import { pages } from './pages'
// import { mountPage, registerPages } from './utils'

// registerPages(pages)
// mountPage()
import Handlebars, { RuntimeOptions } from 'handlebars'
import {
  Component,
  ComponentInterface,
  ComponentExtConstructor,
  ComponentExtOptions,
  defineComponent,
} from './utils'

import testTemplate from './Test.hbs'
import cardTemplate from './Card.hbs'
import inputTemplate from './Input.hbs'

// const templateButton = `<button @click="click">Click me</button>`
// const btn = defineComponent('button', {
//   render: Handlebars.compile(templateButton),
//   methods: {
//     click(e) {
//       console.log('Click btn', e)
//     },
//   },
// })

// class Btn extends Component {
//   protected render(opt: Handlebars.RuntimeOptions): string {
//     throw new Error('Method not implemented.')
//   }
//   private static _template = `<button @click="click">Click me</button>`
//   constructor(props: any, parent?: Component) {
//     super('button', {
//       render: Handlebars.compile(Btn._template),
//       methods: {
//         click(e) {
//           console.log('Click btn', e)
//         },
//       },
//     })
//     this.render = Handlebars.compile(Btn._template).bind(null, {})
//   }
// }

// const templateInput = `<input @input="keyup" ac-model="text">Click me</input>`
// const input = defineComponent('input', {
//   render: Handlebars.compile(templateInput),
//   methods: {
//     keyup: (el: KeyboardEvent) => {
//       console.log('el :>> ', el.target)
//       if (el.target)
//         console.log('Click btn', {
//           input: (el.target as HTMLInputElement).value,
//         })
//     },
//   },
// })

// class Card extends Component {
//   constructor(options: ComponentExtOptions) {
//     super({
//       ...options,
//       name: 'Card',
//       renderer: cardTemplate,
//       // props,
//     })
//   }
// }

const Card = defineComponent({
  name: 'Card',
  renderer: cardTemplate,
  // props,
  events: {
    click(event) {
      console.log('Card event :>> ', event, this)
      // this.res(event)
      this.test++
    },
  },
  data: () => ({
    test: 1,
  }),
})

// class Input extends Component {
//   constructor(options: ComponentExtOptions) {
//     super({
//       ...options,
//       name: 'Input',
//       renderer: inputTemplate,
//       // methods: {
//       //   keyup: (el: KeyboardEvent) => {
//       //     console.log('Input el :>> ', el.target)
//       //     console.log('Input this:>> ', this)
//       //     if (el.target)
//       //       console.log('Input keyup :>> ', {
//       //         input: (el.target as HTMLInputElement).value,
//       //       })
//       //   },
//       // },
//     })
//   }
//   keyup(e: KeyboardEvent) {
//     console.log('Input e :>> ', e)
//     console.log('Input this:>> ', this.name)
//     return true
//   }
// }

const Input = defineComponent({
  name: 'Input',
  renderer: inputTemplate,
})
// const input = new Input({})

// console.log('input :>> ', input)
// console.log('Input :>> ', typeof Input)

// function testFn(con: (new (props: any) => Component)[]) {
//   new con[0]({})
// }
// testFn([Input])
// testFn(Component)
// const template = `<div class="template" @click="test" >{{TestString}}</div>
// <div class="template2" @click="test2">Test string2</div>
// {{>comp name="button" props=TestString }}
// {{>comp name="Input" }}
// `
// export const test = defineComponent('test', {
//   render: Handlebars.compile(template),
//   data: {
//     TestString: 'Test string from template',
//   },
//   methods: {
//     test: (e): void => {
//       console.log('e :>> ', e)
//       console.log('this :>> ', this)
//     },
//     test2(e) {
//       console.log('e :>> ', e)
//     },
//   },
//   components: [Btn, Input],
// })

// class Test extends Component {
//   constructor(options?: ComponentExtOptions) {
//     super({
//       ...options,
//       name: Test.name,
//       renderer: testTemplate,
//       data: () => ({
//         TestString: 'Test string from template',
//         cardProps: {
//           title: 'Card title',
//         },
//         inputs: [
//           {
//             placeholder: 'ведите текст',
//           },
//           {
//             placeholder: 'ведите текст 2',
//           },
//           {
//             placeholder: 'ведите текст 3',
//           },
//         ],
//       }),
//       // methods: {
//       //   test: (e: any): void => {
//       //     console.log('methods e :>> ', e)
//       //     console.log('methods this :>> ', this.name)
//       //   },
//       //   test2: (e: any) => {
//       //     console.log('methods e :>> ', e)
//       //     console.log('methods this :>> ', this.name)
//       //   },
//       // },
//       events: {
//         click: (event) => {
//           console.log('Test event :>> ', event)
//         },
//       },
//       components: [Card, Input],
//     })
//     // this.render = Handlebars.compile(this._template).bind(null, {})
//   }
//   test(e: any) {
//     console.log('e :>> ', e)
//     console.log('this :>> ', this.name)
//   }
//   test2(e: any) {
//     console.log('e :>> ', e)
//     console.log('this :>> ', this.name)
//   }
//   keyup(e: KeyboardEvent) {
//     console.log('Test e :>> ', e.target)
//     console.log('Test this:>> ', this.name)
//   }
// }

const Test = defineComponent({
  name: 'Test',
  renderer: testTemplate,
  data: () => ({
    TestString: 'Test string from template',
    cardProps: {
      title: 'Card title',
    },
    inputs: [
      {
        placeholder: 'ведите текст',
      },
      {
        placeholder: 'ведите текст 2',
      },
      {
        placeholder: 'ведите текст 3',
      },
    ],
  }),
  events: {
    click: (event) => {
      console.log('Test event :>> ', event)
    },
  },
  components: [Card, Input],
})

// const precompiled = Handlebars.precompile(Test._template)

const test = new Test({})

test.mount('#app')
console.log('test :>> ', test)
console.log('success')
setTimeout(() => {
  test.setProps({
    TestString: 'Test string from template 1',
  })
}, 2000)
