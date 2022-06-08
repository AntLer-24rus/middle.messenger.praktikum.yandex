/* eslint-disable no-unused-expressions */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import { spy } from 'sinon'
import { Component } from './Component'

// const dom = new JSDOM('<div id="app"></div>', {
//   url: 'http://localhost:1234',
// })

type DataType = {
  exampleData: string
}

type PropsType = {
  exampleProps: string
}

class TestComponent extends Component<DataType, PropsType> {
  protected render(context: any): DocumentFragment {
    const template = document.createElement('template')
    template.innerHTML = `<div>TestComponent ${context.exampleData}</div>`
    return template.content
  }
}

const TestComponentProps = { exampleProps: 'exampleProps' }
const TestComponentData = { exampleData: 'exampleData' }
const TestComponentDOMEvents = { click: () => {} }
const TestComponentListeners = [
  {
    eventName: 'testEvent',
    callback: () => {},
  },
]

function getTestComponent(name = 'TestComponent') {
  return new TestComponent({
    name,
    props: { ...TestComponentProps },
    data() {
      return {
        ...TestComponentData,
        calc: this.exampleProps,
      }
    },
    listeners: TestComponentListeners,
    DOMEvents: TestComponentDOMEvents,
  })
}

describe('Component', () => {
  before(() => {
    const dom = new JSDOM('<div id="app"></div>', {
      url: 'http://localhost:1234',
    })
    global.window = dom.window as unknown as Window & typeof globalThis
    global.document = dom.window.document
  })

  describe('new Component()', () => {
    it('должен только создавать компонент не отрисовывать его', () => {
      const comp = getTestComponent()

      expect(() => comp.element).to.throw('Элемент еще не создан')
    })

    it('props и data должны объединиться', () => {
      const comp = getTestComponent()

      expect(comp.data).to.deep.equal({
        ...TestComponentData,
        ...TestComponentProps,
        calc: TestComponentProps.exampleProps,
      })
    })

    it('должен присвоить имя', () => {
      const comp = getTestComponent()

      expect(comp.name).to.be.equal('TestComponent')
    })

    it('должен присвоить id', () => {
      const comp = getTestComponent()

      expect(comp.id).to.not.be.null.and.to.not.be.undefined.and.to.not.be.empty
    })

    it('должен присвоить DOMEvent', () => {
      const clickSpy = spy(TestComponentDOMEvents, 'click')
      const comp = getTestComponent()

      comp.emit(Component.emits.NATIVE_EVENT, 'click')

      expect(clickSpy.called).to.true
      clickSpy.restore()
    })

    it('должен присвоить listeners', () => {
      const callbackSpy = spy(TestComponentListeners[0], 'callback')
      const comp = getTestComponent()

      comp.emit(TestComponentListeners[0].eventName)

      expect(callbackSpy.called).to.true
      callbackSpy.restore()
    })
  })

  describe('.appendChildren()', () => {
    it('должен добавлять ребенка родителю', () => {
      const parent = getTestComponent()
      const child = getTestComponent()

      parent.appendChildren(child)

      expect(parent.children).to.deep.includes(child)
    })

    it('должен добавлять родителя ребенку', () => {
      const parent = getTestComponent()
      const child = getTestComponent()

      parent.appendChildren(child)

      expect(child.parent).to.deep.eq(parent)
    })

    it('должен возвращать добавленного ребенка', () => {
      const parent = getTestComponent()
      const child = getTestComponent()

      expect(parent.appendChildren(child)).to.deep.equal(child)
    })
  })

  describe('.getParentByName()', () => {
    it('должен возвращать родителя по имени', () => {
      const parent = getTestComponent('ParentName')
      const childOne = getTestComponent('ChildNameOne')
      const childTwo = getTestComponent('ChildNameTwo')

      parent.appendChildren(childOne).appendChildren(childTwo)

      expect(childTwo.getParentByName('ParentName')).to.deep.equal(parent)
    })

    it('должен вернуть undefined если не нашел родителя', () => {
      const parent = getTestComponent('ParentName')
      const childOne = getTestComponent('ChildNameOne')
      const childTwo = getTestComponent('ChildNameTwo')

      parent.appendChildren(childOne).appendChildren(childTwo)

      expect(childTwo.getParentByName('Root')).to.be.undefined
    })
  })

  describe('.getChildrenByName()', () => {
    it('должен возвращать ребенка по имени', () => {
      const parent = getTestComponent('ParentName')
      const childOne = getTestComponent('ChildNameOne')
      const childTwo = getTestComponent('ChildNameTwo')

      parent.appendChildren(childOne)
      parent.appendChildren(childTwo)

      expect(parent.getChildrenByName('ChildNameTwo')).to.deep.equal(childTwo)
    })

    it('должен вернуть undefined если не нашел ребенка', () => {
      const parent = getTestComponent('ParentName')
      const childOne = getTestComponent('ChildNameOne')
      const childTwo = getTestComponent('ChildNameTwo')

      parent.appendChildren(childOne)
      parent.appendChildren(childTwo)

      expect(childTwo.getChildrenByName('Root')).to.be.undefined
    })
  })

  describe('.getContent()', () => {
    it('должен возвращать элемент после рендера', () => {
      const comp = getTestComponent()

      comp.emit(Component.emits.RENDER)

      expect(comp.getContent().outerHTML).to.equal(
        '<div>TestComponent exampleData</div>'
      )
    })

    it('должен возвращать ошибку если не было рендера', () => {
      const comp = getTestComponent()

      expect(comp.getContent.bind(comp)).to.throw(
        'Запрос на получение компонента до инициализации'
      )
    })
  })

  describe('.setProps()', () => {
    it('должен вызывать перерисовку', () => {
      const comp = getTestComponent()

      comp.emit(Component.emits.RENDER)
      expect(comp.element.outerHTML).to.be.equal(
        '<div>TestComponent exampleData</div>'
      )

      comp.setProps({ exampleData: 'new data' })

      expect(comp.element.outerHTML).to.be.equal(
        '<div>TestComponent new data</div>'
      )
    })

    it('должен обновлять data у компонента', () => {
      const comp = getTestComponent()

      comp.emit(Component.emits.RENDER)
      const { exampleData } = comp.data

      comp.setProps({ exampleData: 'new data' })

      expect(comp.data.exampleData).to.not.equal(exampleData)
    })

    it('не должен перерисовывать компонент если свойства не изменились', () => {
      const comp = getTestComponent()

      comp.emit(Component.emits.RENDER)
      const { element } = comp

      comp.setProps({ exampleData: 'exampleData' })

      expect(comp.element).to.be.deep.equal(element)
    })
  })

  describe('.show()', () => {
    it('должен обнулить inline стиль display', () => {
      const comp = getTestComponent()

      comp.emit(Component.emits.RENDER)
      comp.element.style.display = 'none'
      expect(comp.element.outerHTML).to.equal(
        '<div style="display: none;">TestComponent exampleData</div>'
      )
      comp.show()

      expect(comp.element.outerHTML).to.equal(
        '<div style="">TestComponent exampleData</div>'
      )
    })
  })

  describe('.hide()', () => {
    it('должен установить inline стиль display', () => {
      const comp = getTestComponent()

      comp.emit(Component.emits.RENDER)
      comp.hide()

      expect(comp.element.outerHTML).to.equal(
        '<div style="display: none;">TestComponent exampleData</div>'
      )
    })
  })

  describe('.mount()', () => {
    it('должен смонтировать компонент', () => {
      const comp = getTestComponent()

      comp.emit(Component.emits.RENDER)
      comp.mount('#app')

      const root = document.getElementById('app')
      expect(root?.innerHTML).to.be.equal(
        '<div>TestComponent exampleData</div>'
      )
    })
  })
})
