/* eslint
    no-use-before-define: off,
    no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_instance"] }]
*/
import { ExtendControllerConstructor } from './Controller'
import { Route } from './Route'

export class Router {
  private static _instance: Router | null = null

  routes: Route[]

  history: History

  private _currentRoute: Route | undefined

  private _rootQuery = ''

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

  use(pathname: string, pageController: ExtendControllerConstructor) {
    const route = new Route(pathname, pageController, {
      rootQuery: this._rootQuery,
    })
    this.routes.push(route)
    return this
  }

  useErrorPage(pageController: ExtendControllerConstructor) {
    this._errorRoute = new Route('/error', pageController, {
      rootQuery: this._rootQuery,
    })
    return this
  }

  start(rootSelector: string) {
    this._rootQuery = rootSelector
    window.onpopstate = (event) => {
      if (event.currentTarget instanceof Window) {
        this._onRoute(event.currentTarget.location.pathname)
      }
    }

    this._onRoute(window.location.pathname)
  }

  private _onRoute(pathname: string) {
    let route: Route | undefined = this.getRoute(pathname)

    if (!route) {
      route = this._errorRoute
      if (!route) {
        throw new Error('Error page undefined')
      }
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
      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }
      route = this._errorRoute
      if (!route) {
        throw new Error('Error page undefined')
      }
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
