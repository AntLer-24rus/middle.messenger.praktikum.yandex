import { RegistrationPage } from '../pages'
import { AuthService } from '../services'
import { connect, Controller, Router } from '../utils'

export class RegistrationPageController extends Controller<
  InstanceType<typeof RegistrationPage>
> {
  private _authService = new AuthService()

  constructor(options: ConstructorParameters<typeof RegistrationPage>[0]) {
    super(new RegistrationPage(options))

    connect(
      this.baseComponent,
      RegistrationPage.emits.signUp,
      this._authService,
      AuthService.listening.signUp
    )
    connect(this.baseComponent, RegistrationPage.emits.signIn, () => {
      Router.instance().go('/')
    })
    connect(this._authService, AuthService.emits.userInfo, (user) => {
      if (user.id) {
        Router.instance().go('/chats')
      }
    })
  }
}
