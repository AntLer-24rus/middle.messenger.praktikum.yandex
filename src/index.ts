import { DevPanel } from './modules'
import { ErrorPage, pages } from './pages'
import type { Component } from './utils'

document.addEventListener('DOMContentLoaded', () => {
  if (process.env.NODE_ENV !== 'production') {
    const app = document.querySelector('#app') as HTMLElement
    app.style.height = 'calc(100vh - 55px)'
    const body = document.querySelector('body') as HTMLBodyElement
    const devPanelEL = document.createElement('div')
    devPanelEL.id = 'dev-panel'
    body.insertAdjacentElement('afterbegin', devPanelEL)
  }

  let page: Component
  function renderPage(href: string) {
    window.history.pushState(null, '', href)
    const baseTitle = document.title.replace(/\s\|.*/gm, '')
    const Page = pages.find((p) => p.href === href)
    if (href === '/') {
      document.title = `${baseTitle} | home`
      page = new pages[0].Comp({})
    } else if (Page) {
      document.title = `${baseTitle} | ${Page.text}`
      let props = {}
      if (href === '/error')
        props = {
          code: '500',
          textError: 'Меняем электро проигрыватель на электро выигрыватель',
        }
      else if (href === '/unknown')
        props = {
          code: '404',
          textError: 'Кажется такой страницы нет...',
        }
      page = new Page.Comp({ props })
    } else {
      page = new ErrorPage({
        props: {
          code: '404',
          textError: 'Кажется такой страницы нет...',
        },
      })
    }
    page.mount('#app')
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
