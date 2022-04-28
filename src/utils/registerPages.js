import Handlebars from 'handlebars'

export function registerPages(pages) {
  for (const [path, page] of pages) {
    if (!path.startsWith('/')) continue
    Handlebars.registerPartial(path, page.render)
  }
  // Set home page render -> url: '/'
  Handlebars.registerPartial('/', pages.get('/login').render())
  if (process.env.NODE_ENV !== 'production') {
    // Set handler for generate 500 error
    Handlebars.registerPartial('/error', () => {})
  }
}
