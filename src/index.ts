// import { pages } from './pages'
// import { mountPage, registerPages } from './utils'

// registerPages(pages)
// mountPage()

import { defineHBSComponent } from './utils'

import testTemplate from './Test.hbs'
import cardTemplate from './Card.hbs'
import inputTemplate from './Input.hbs'

const Card = defineHBSComponent({
  name: 'Card',
  renderer: cardTemplate,
  props: {
    title: 'DEfault card title',
  },
  nativeEvents: {
    click(event) {
      event.stopPropagation()
      console.log('Card event :>> ', event)
      // this.res(event)
      this.test++
      this.title = `${this.title} (${this.test})`
    },
  },
  data: () => ({
    test: 1,
  }),
})

const Input = defineHBSComponent({
  name: 'Input',
  renderer: inputTemplate,
  props: {},
  nativeEvents: {
    keyup(event) {
      event.stopPropagation()
      const input = event.target as HTMLInputElement
      console.log('Event in Input :>> ', input.value)
      // this.value = input.value
    },
  },
})

const Test = defineHBSComponent({
  name: 'Test',
  renderer: testTemplate,
  props: {},
  data: () => ({
    TestString: 'Test string from template',
    cardTitle: 'Card title',
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
  nativeEvents: {
    // click: (event) => {
    //   console.log('Test event :>> ', event)
    // },
    test2(event) {
      console.log('Event in Test test2 :>>', this)
    },
    test(event) {
      event.stopPropagation()
      console.log('Event in Test test :>>', this)
      this.cardTitle = 'te1'
    },
  },
  components: [Card, Input],
})

const test = new Test({})

test.mount('#app')

console.log('SUCCESS', test)

setTimeout(() => {
  test.setProps({
    TestString: 'Test string from template 1',
    cardTitle: 'Changed title',
  })
}, 5000)
