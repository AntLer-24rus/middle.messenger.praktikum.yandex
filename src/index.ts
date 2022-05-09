// import { pages } from './pages'
// import { mountPage, registerPages } from './utils'

// registerPages(pages)
// mountPage()

import DevPanel from './modules/dev-panel'

import LoginPage from './pages/login'

document.addEventListener('DOMContentLoaded', () => {
  // if (process.env.NODE_ENV !== 'production') {
  const app = document.querySelector('#app') as HTMLElement
  app.style.height = 'calc(100vh - 55px)'
  const body = document.querySelector('body') as HTMLBodyElement
  const devPanelEL = document.createElement('div')
  devPanelEL.id = 'dev-panel'
  body.insertAdjacentElement('afterbegin', devPanelEL)

  // }

  const pages = [{ href: '/login', text: 'login', Comp: LoginPage }]
  let page

  const devPanel = new DevPanel({
    props: { pages },
    listeners: [
      {
        eventName: 'update-page',
        callback: (href: string) => {
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
        },
      },
    ],
  })
  devPanel.mount('#dev-panel')
  page = new LoginPage({})
  page.mount('#app')
})
