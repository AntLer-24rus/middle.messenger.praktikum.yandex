/* eslint-disable no-unused-expressions */
/* eslint-disable max-classes-per-file */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import { SinonSpy, SinonStub, spy, stub } from 'sinon'
import { Router } from './Router'

describe('Router', () => {
  let router: Router
  let HomeControllerEmit: SinonStub<any[], any>
  let HomeController: SinonStub<any[], any>
  let ErrorControllerEmit: SinonStub<any[], any>
  let ErrorController: SinonStub<any[], any>
  const END_POINT_GO = '/test'
  let TestControllerEmit: SinonSpy<any[], any>
  let TestController: SinonStub<any[], any>

  before(() => {
    const dom = new JSDOM('<div id="app"></div>', {
      url: 'http://localhost:1234',
    })
    global.window = dom.window as unknown as Window & typeof globalThis
    global.document = dom.window.document

    router = Router.instance()
    HomeControllerEmit = stub().named('HomeEmit')
    HomeController = stub().returns({
      emit: HomeControllerEmit,
    })
    ErrorControllerEmit = stub().named('ErrorEmit')
    ErrorController = stub().returns({
      emit: ErrorControllerEmit,
    })

    TestControllerEmit = spy().named('TestControllerEmit')
    TestController = stub().returns({
      emit: TestControllerEmit,
    })
  })

  afterEach('очистка стабов', () => {
    HomeControllerEmit.resetHistory()
    HomeController.resetHistory()
    ErrorControllerEmit.resetHistory()
    ErrorController.resetHistory()
  })

  it('должен быть синглтоном', () => {
    expect(router).to.eq(Router.instance())
  })

  describe('.use()', () => {
    it('должен возвращать экземпляр Router', () => {
      const result = router.use('/', HomeController as any)

      expect(result).to.eq(router)
    })
  })

  describe('.useErrorPage()', () => {
    it('должен возвращать экземпляр Router', () => {
      const result = router.useErrorPage(ErrorController as any)

      expect(result).to.eq(result)
    })
  })

  describe('.start()', () => {
    it('должен подписаться на событие onpopstate', () => {
      expect(window.onpopstate).to.be.null

      router.start('#app')

      expect(window.onpopstate).not.to.be.null
    })

    it('должен вызывать emit с событием Controller:mount и аргументом #app', () => {
      window.onpopstate = null

      router.start('#app')

      expect(HomeControllerEmit.calledWith('Controller:mount', '#app')).to.be
        .true
    })
  })

  describe('.go()', () => {
    afterEach('очистка стабов', () => {
      router.go('/')
      TestControllerEmit.resetHistory()
      TestController.resetHistory()
    })

    it('должен создавать экземпляр переданного контролера при первом вызове', () => {
      router.use(END_POINT_GO, TestController as any).go(END_POINT_GO)

      expect(TestController.calledWithNew()).to.be.true
    })

    it('не должен создать экземпляр контроллера при последующих вызовах', () => {
      router.go(END_POINT_GO)

      expect(TestController.notCalled).to.be.true
    })

    it('должен вызывать emit у контроллера дважды', () => {
      router.go(END_POINT_GO)

      expect(TestControllerEmit.calledTwice).to.true
    })

    it('первый вызов emit у контроллера должен быть с событием Controller:mount', () => {
      router.go(END_POINT_GO)

      expect(TestControllerEmit.getCall(0).args[0]).to.be.eq('Controller:mount')
    })

    it('второй вызов emit у контроллера должен быть с событием Controller:show', () => {
      router.go(END_POINT_GO)

      expect(TestControllerEmit.getCall(1).args[0]).to.be.eq('Controller:show')
    })
  })
})
