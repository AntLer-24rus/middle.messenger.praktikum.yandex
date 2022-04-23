import Handlebars from 'handlebars'

import { pages } from '../pages'
import { devPanel } from '../modules'

Handlebars.registerHelper('pageName', () => window.location.pathname)
const pageTemplate = Handlebars.compile('{{> (pageName) }}')
const errorPage = pages.get('error')

function renderPage() {
  const rootNode = document.getElementById('app')
  try {
    rootNode.innerHTML = pageTemplate()
  } catch (error) {
    if (error.message.includes('could not be found'))
      rootNode.innerHTML = errorPage.render({
        code: '404',
        text: 'Кажется такой страницы нет...',
      })
    else
      rootNode.innerHTML = errorPage.render({
        code: '500',
        text: 'Меняем электро проигрыватель на электро выигрыватель',
      })
  }
}

export function mountPage() {
  if (process.env.NODE_ENV !== 'production') {
    const app = document.querySelector('#app')
    app.style.height = 'calc(100vh - 55px)'
    const body = document.querySelector('body')
    body.insertAdjacentHTML(
      'afterbegin',
      devPanel.render({
        pages: Array.from(pages.keys()).filter((p) => p.startsWith('/')),
        rerender: renderPage,
      })
    )
  }
  renderPage()
}
