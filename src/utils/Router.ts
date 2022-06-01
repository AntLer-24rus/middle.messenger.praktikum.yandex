/* eslint no-use-before-define: "off", no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_instance"] }] */
import type { ExtendComponentConstructor } from './Component'
import { Route } from './Route'

export class Router {
  private static _instance: Router | null = null

  routes: Route[]

  history: History

  private _currentRoute: Route | undefined

  private _rootQuery: any

  private _errorRoute: Route | undefined

  private constructor() {
    this.routes = []
    this.history = window.history
  }

  static instance(): Router {
    if (Router._instance === null) {
      Router._instance = new Router()
    }
    return Router._instance
  }

  use(pathname: string, page: ExtendComponentConstructor) {
    const route = new Route(pathname, page, { rootQuery: this._rootQuery })
    this.routes.push(route)
    return this
  }

  useErrorPage(page: ExtendComponentConstructor) {
    this._errorRoute = new Route('/error', page, { rootQuery: this._rootQuery })
    return this
  }

  start(rootSelector: string) {
    this._rootQuery = rootSelector
    window.onpopstate = (event) => {
      console.log('event :>> ', event)
      // @ts-ignore
      this._onRoute(event.currentTarget.location.pathname)
    }

    this._onRoute(window.location.pathname)
  }

  private _onRoute(pathname: string) {
    let route: Route | undefined = this.getRoute(pathname)

    if (!route) {
      route = this._errorRoute!
      route.setProps({
        code: '404',
        textError: 'Кажется такой страницы нет...',
      })
    }

    if (this._currentRoute) {
      this._currentRoute.leave()
    }

    this._currentRoute = route
    try {
      route.render(this._rootQuery)
    } catch (error) {
      route = this._errorRoute!
      this._currentRoute = route
      route.setProps({
        code: '500',
        textError: 'Меняем электро проигрыватель на электро выигрыватель',
      })
      route.render(this._rootQuery)
    }
  }

  go(pathname: string) {
    this.history.pushState({}, '', pathname)
    this._onRoute(pathname)
  }

  back() {
    this.history.back()
  }

  forward() {
    this.history.forward()
  }

  getRoute(pathname: string) {
    return this.routes.find((route) => route.match(pathname))
  }
}
