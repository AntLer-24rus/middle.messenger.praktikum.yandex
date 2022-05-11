import LoginPage from './login/login'
import RegistrationPage from './registration/registration'
import ChatsPage from './chats/chats'
import ErrorPage from './error/error'
// import profilePage from './profile/profile'

export const pages = [
  { href: '/login', text: 'login', Comp: LoginPage },
  { href: '/registration', text: 'registration', Comp: RegistrationPage },
  { href: '/chats', text: 'chats', Comp: ChatsPage },
  { href: '/error', text: 'error', Comp: ErrorPage },
  { href: '/unknown', text: 'unknown', Comp: ErrorPage },
]
