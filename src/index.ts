import { ErrorPage } from './pages'
import { ChatsPage } from './pages/chats'
import { LoginPage } from './pages/login'
import { RegistrationPage } from './pages/registration'
import { Router } from './utils'

const router = Router.instance()

router
  .useErrorPage(ErrorPage)
  .use('/', LoginPage)
  .use('/signup', RegistrationPage)
  .use('/chats', ChatsPage)
  .start('#app')
