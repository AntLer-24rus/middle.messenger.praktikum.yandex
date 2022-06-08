import { LoginPage } from '../pages'
import { AuthService } from '../services'
import { connect, Controller, Router } from '../utils'

export class LoginPageController extends Controller<
  InstanceType<typeof LoginPage>
> {
  private _authService = new AuthService()

  constructor(options: ConstructorParameters<typeof LoginPage>[0]) {
    super(new LoginPage(options))

    connect(
      this.baseComponent,
      LoginPage.emits.signIn,
      this._authService,
      AuthService.listening.signIn
    )
    connect(
      this._authService,
      AuthService.emits.signIn,
      this._authService,
      AuthService.listening.userInfo
    )
    connect(this.baseComponent, LoginPage.emits.signUp, () => {
      Router.instance().go('/signup')
    })
    connect(this._authService, AuthService.emits.userInfo, () => {
      Router.instance().go('/chats')
    })
  }
}
