import { ErrorPage } from '../pages'
import { connect, Controller, Router } from '../utils'

export class ErrorPageController extends Controller<
  InstanceType<typeof ErrorPage>
> {
  constructor(options: ConstructorParameters<typeof ErrorPage>[0]) {
    super(new ErrorPage(options))
    connect(this.baseComponent, ErrorPage.emits.back, () => {
      Router.instance().back()
    })
  }
}
