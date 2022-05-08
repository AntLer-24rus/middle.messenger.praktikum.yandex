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
  // props,
  events: {
    click(event) {
      event.stopPropagation()
      console.log('Card event :>> ', event)
      // this.res(event)
      this.test++
    },
  },
  data: () => ({
    test: 1,
  }),
})

const Input = defineHBSComponent({
  name: 'Input',
  renderer: inputTemplate,
})

const Test = defineHBSComponent({
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
    // click: (event) => {
    //   console.log('Test event :>> ', event)
    // },
  },
  components: [Card, Input],
})

const test = new Test({})

test.mount('#app')

console.log('SUCCESS', test)

setTimeout(() => {
  test.setProps({
    TestString: 'Test string from template 1',
  })
}, 5000)
