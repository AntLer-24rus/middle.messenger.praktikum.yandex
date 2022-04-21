const express = require('express')
const { join } = require('path')

const publicPath = join(__dirname, '..', 'dist')

const app = express()

app.use(express.static(publicPath, { index: false }))
app.use('*', (_, res) => res.sendFile(join(publicPath, 'index.html')))

app.listen(3000, () => {
  console.log('Server listening port 3000...')
})
