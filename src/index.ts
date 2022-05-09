// import { pages } from './pages'
// import { mountPage, registerPages } from './utils'

// registerPages(pages)
// mountPage()

import DevPanel from './modules/dev-panel'

import LoginPage from './pages/login'
import RegistrationPage from './pages/registration'

document.addEventListener('DOMContentLoaded', () => {
  // if (process.env.NODE_ENV !== 'production') {
  const app = document.querySelector('#app') as HTMLElement
  app.style.height = 'calc(100vh - 55px)'
  const body = document.querySelector('body') as HTMLBodyElement
  const devPanelEL = document.createElement('div')
  devPanelEL.id = 'dev-panel'
  body.insertAdjacentElement('afterbegin', devPanelEL)

  // }

  const pages = [
    { href: '/login', text: 'login', Comp: LoginPage },
    { href: '/registration', text: 'registration', Comp: RegistrationPage },
  ]
  let page
  function renderPage(href: string) {
    window.history.pushState(null, '', href)
    const baseTitle = document.title.replace(/\s\|.*/gm, '')
    const Page = pages.find((p) => p.href === href)
    if (href === '/') {
      document.title = `${baseTitle} | home`
    } else if (Page) {
      document.title = `${baseTitle} | ${Page.text}`
      page = new Page.Comp({})
      page.mount('#app')
    }
  }

  const devPanel = new DevPanel({
    props: { pages },
    listeners: [
      {
        eventName: 'update-page',
        callback: renderPage,
      },
    ],
  })
  devPanel.mount('#dev-panel')
  renderPage(window.location.pathname)
})
