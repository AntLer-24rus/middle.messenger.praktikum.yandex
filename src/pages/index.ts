import { LoginPage } from './login'
import { RegistrationPage } from './registration'
import { ChatsPage } from './chats'
import { ErrorPage } from './error'

export { ErrorPage } from './error'
export const pages = [
  { href: '/login', text: 'login', Comp: LoginPage },
  { href: '/registration', text: 'registration', Comp: RegistrationPage },
  { href: '/chats', text: 'chats', Comp: ChatsPage },
  { href: '/error', text: 'error', Comp: ErrorPage },
  { href: '/unknown', text: 'unknown', Comp: ErrorPage },
]
