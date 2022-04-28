import { loginPage } from './login/login'
import { registrationPage } from './registration/registration'
import { chatsPage } from './chats/chats'
import { errorPage } from './error/error'
import { profilePage } from './profile/profile'

export const pages = new Map([
  ['/login', loginPage],
  ['/registration', registrationPage],
  ['/chats', chatsPage],
  ['/profile', profilePage],
  ['error', errorPage],
])
