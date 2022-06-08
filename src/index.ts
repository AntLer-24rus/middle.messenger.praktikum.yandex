import {
  LoginPageController,
  RegistrationPageController,
  ChatsPageController,
  ErrorPageController,
} from './controllers'
import { Router } from './utils'

const router = Router.instance()

router
  .useErrorPage(ErrorPageController)
  .use('/', LoginPageController)
  .use('/signup', RegistrationPageController)
  .use('/chats', ChatsPageController)
  .start('#app')
