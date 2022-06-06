/* eslint
    no-use-before-define: off,
    no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_instance"] }]
*/
import { ExtendControllerConstructor } from './Controller'
import { Route } from './Route'

export class Router {
  private static _instance: Router | null = null

  private _routes: Route[]

  private _history: History

  private _currentRoute: Route | undefined

  private _rootQuery = ''

  private _errorRoute: Route | undefined

  private constructor() {
    this._routes = []
    this._history = window.history
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
    this._routes.push(route)
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
    window.onpopstate = () => {
      this._onRoute(window.location.pathname)
    }

    this._onRoute(window.location.pathname)
  }

  go(pathname: string) {
    this._history.pushState({}, '', pathname)
    this._onRoute(pathname)
  }

  back() {
    this._history.back()
  }

  forward() {
    this._history.forward()
  }

  private _onRoute(pathname: string) {
    let route: Route | undefined = this.getRoute(pathname)

    if (!route) {
      route = this._errorRoute
      if (!route) {
        throw new Error('Error page undefined 400')
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
        let errorDescribe = 'Undefined'
        if (error instanceof Error) {
          errorDescribe = error.message
        }
        throw new Error(`Error page undefined 500 - ${errorDescribe}`)
      }
      this._currentRoute = route
      route.setProps({
        code: '500',
        textError: 'Меняем электро проигрыватель на электро выигрыватель',
      })
      route.render(this._rootQuery)
    }
  }

  private getRoute(pathname: string) {
    return this._routes.find((route) => route.match(pathname))
  }
}
