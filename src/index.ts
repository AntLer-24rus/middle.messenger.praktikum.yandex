import {
  ChatsPageController,
  ErrorPageController,
  LoginPageController,
  RegistrationPageController,
} from './controllers'
import './style.scss'
import { Router } from './utils'

const router = Router.instance()

router
  .useErrorPage(ErrorPageController)
  .use('/', LoginPageController)
  .use('/signup', RegistrationPageController)
  .use('/chats', ChatsPageController)
  .start('#app')
